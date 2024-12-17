import os
import time
import datetime
import hashlib
from flask_session import Session
from datetime import timedelta
from flask import Flask, session, jsonify, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO, join_room, leave_room, send, emit
from flask_cors import CORS, cross_origin
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
from sqlalchemy.exc import OperationalError, DisconnectionError
from sqlalchemy.pool import QueuePool

load_dotenv()

app = Flask(__name__, static_folder='../build', static_url_path='/')

mysql_jabberusers = os.environ.get("mysql_user", 'root')
mysql_password = os.environ.get("mysql_password", '')
mysql_host = os.environ.get("mysql_host", 'localhost')
mysql_port = int(os.environ.get("mysql_port", 3306))
mysql_db = os.environ.get("mysql_db", 'jabber')
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+mysqlconnector://{mysql_jabberusers}:{mysql_password}@{mysql_host}:{mysql_port}/{mysql_db}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Disable SQLAlchemy modification tracking
app.config['SESSION_TYPE'] = 'filesystem'
app.config['_KEY'] = 'supersecretkey'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=20000)
app.config.update(SESSION_COOKIE_SAMESITE="None", SESSION_COOKIE_SECURE=True)

# Configuración del pool de conexiones
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'poolclass': QueuePool,
    'pool_size': 10,
    'max_overflow': 20,
    'pool_timeout': 30,
    'pool_recycle': 1800,
    'pool_pre_ping': True  # Verifica conexiones antes de usarlas
}

print(mysql_jabberusers, mysql_password, mysql_host, mysql_port, mysql_db, "envvvv")
Session(app)
socketio = SocketIO(app, cors_allowed_origins=os.environ.get("origins", 'http://localhost:5173'))

db = SQLAlchemy(app)
CORS(app, supports_credentials=True, origins=[os.environ.get("origins", 'http://localhost:5173')])  # Allowing CORS requests from the frontend

# Función para intentar conectar a la base de datos con reintentos
def connect_with_retry():
    retries = 5
    for i in range(retries):
        try:
            db.engine.connect()
            print("Database connection successful")
            break
        except OperationalError as e:
            print(f"Database connection failed: {e}")
            if i < retries - 1:
                print("Retrying...")
                time.sleep(5)
            else:
                print("All retries failed. Exiting.")
                raise

with app.app_context():
    connect_with_retry()

# jabberusers model definition
class jabberusers(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    location = db.Column(db.String(100))  # User location
    languages = db.Column(db.String(200))  # User languages
    password_hash = db.Column(db.String(128))  # Password hash

    @property
    def password(self):
        raise AttributeError('password is not readable attribute')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password,'pbkdf2')
        print(f'Password hash set for {self.username}: {self.password_hash}')  # Debug print

    def __repr__(self):
        return f'<jabberusers {self.username}>'

    def check_password(self, password):
        result = check_password_hash(self.password_hash, password)
        print(f'Checking password for {self.username}: {result} - {self.password_hash} - {password}')  # Debug print
        return result

# Message model definition
class JabberMessages(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('jabberusers.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('jabberusers.id'),  nullable=True)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.datetime.utcnow, nullable=False)
    room = db.Column(db.String(100), default=0, nullable=True)

    def __repr__(self):
        return f'<JabberMessages {self.id}>'

    def serialize(self):
        return {
            'id': self.id,
            'sender_id': self.sender_id,
            'receiver_id': self.receiver_id,
            'content': self.content,
            'timestamp': self.timestamp.isoformat(),
        }

# Absolute path to the frontend directory
frontend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'FrontEnd'))

#Del session
@app.route('/api/logout', methods=['GET'])
@cross_origin(supports_credentials=True)
def logout():
    session.clear()
    return jsonify({"message": "Logged out!"})

#get session
@app.route('/api/getsession', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_session():
    if 'username' in session:
        return jsonify({
            'username': session['username'],
            'email': session['email'],
            'userId': session['userId']
        })
    return jsonify({'message': 'No session data found.'})

# Static route for the frontend
@app.route('/')
def index():
    return send_from_directory(frontend_dir, 'index.html')

# 404 error handler
@app.errorhandler(404)
def not_found(e):
    return send_from_directory(frontend_dir, 'index.html')

# Example API route to get current time
@app.route('/api/time')
def get_current_time():
    return {'time': time.time()}

# Register endpoint
@app.route('/api/register', methods=['POST'])
@cross_origin(supports_credentials=True)
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    if len(username) > 10 or len(username) < 4:
        return jsonify({'JabberMessages': 'Username must be between 4 and 12 characters.'}), 400

    # Check if the user already exists
    if jabberusers.query.filter_by(username=username).first() or jabberusers.query.filter_by(email=email).first():
        return jsonify({'JabberMessages': 'User already exists.'}), 400

    # Create a new user
    if not check_password(password):
        return jsonify({'JabberMessages': 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number.'}), 400
    new_user = jabberusers(username=username, email=email)
    new_user.password = password  # Use the password setter to hash the password
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'JabberMessages': 'User registered successfully.'}), 201


def check_password(password):
    if len(password) < 8:
        return False
    else:
        if not any(char.isdigit() for char in password):
            return False
        elif not any(char.isalpha() for char in password):
            return False
        elif not any(char.isupper() for char in password):
            return False
        elif not any(char.islower() for char in password):
            return False
        else:
            return True
# Login endpoint
@app.route('/api/login', methods=['POST'])
def login():
    try:
        # Obtén los datos enviados en la solicitud
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No input data provided'}), 400

        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({'error': 'Username and password are required'}), 400

        # Busca el usuario en la base de datos
        user = jabberusers.query.filter_by(username=username).first()

        # Verifica que el usuario exista y que la contraseña sea correcta
        if user and user.check_password(password):
            session['username'] = user.username
            session['userId'] = user.id
            session['email'] = user.email
            session.modified = True
            return jsonify({'message': 'Login successful.'}), 200
        else:
            return jsonify({'error': 'Incorrect username or password.'}), 401

    except OperationalError as e:
        # Maneja errores de conexión a la base de datos
        app.logger.error(f"Database connection error: {e}")
        return jsonify({'error': 'Database connection error. Please try again later.'}), 500

    except Exception as e:
        # Maneja cualquier otro error inesperado
        app.logger.error(f"Unexpected error: {e}")
        return jsonify({'error': 'An unexpected error occurred.'}), 500
# User profile endpoint
@app.route('/api/profile', methods=['GET', 'POST'])
@app.route('/api/profile/<int:user_id>', methods=['GET', 'POST'])
@cross_origin(supports_credentials=True)
def profile(user_id=None):
    if user_id is None:
        if 'userId' not in session:
            return jsonify({'JabberMessages': 'User not logged in.'}), 401
        userId = session['userId']
    else:
        userId = user_id

    user = jabberusers.query.filter_by(id=userId).first()
    if not user:
        return jsonify({'JabberMessages': 'User not found.'}), 401

    if request.method == 'GET':
        # Return user profile data (excluding sensitive information)
        return jsonify({
            'username': user.username,
            'email': user.email,
            'location': user.location,
            'languages': user.languages,
        })

    elif request.method == 'POST':
        # Update user profile data
        data = request.get_json()
        # Update profile fields
        if 'username' in data:
            if len(data['username']) > 10 or len(data['username']) < 4:
                return jsonify({'JabberMessages': 'Username must be between 4 and 12 characters.'}), 400
            user.username = data['username']
        elif 'email' in data:
            user.email = data['email']
        elif 'location' in data:
            user.location = data['location']
        elif 'languages' in data:
            user.languages = data['languages']
        elif 'password' in data:
            if not check_password(data['password']):
                return jsonify({'JabberMessages': 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number.'}), 400
            user.password = data['password']
        db.session.commit()
        return jsonify({'JabberMessages': 'Profile updated successfully.'}), 200


@app.route('/api/messageoptions', methods=['POST'])
@cross_origin(supports_credentials=True)
def messageoptions():
    if 'userId' not in session:
        return jsonify({'JabberMessages': 'User not logged in.'}), 401

    userId = session['userId']
    data = request.get_json()
    messageId = data.get('messageId')
    option = data.get('option')
    message = JabberMessages.query.filter_by(id=messageId).first()

    if not message:
        return jsonify({'JabberMessages': 'Message not found.'}), 404

    if message.sender_id != userId:
        return jsonify({'JabberMessages': 'Petición bloqueada.'}), 403

    if option == 'delete':
        db.session.delete(message)
        db.session.commit()
        
        socketio.emit('message_deleted', {'messageId': messageId}, room=message.room)
        return jsonify({'JabberMessages': 'Message deleted successfully.'}), 200
    elif option == 'edit':
        message.content = data.get('content')
        db.session.commit()
        
        socketio.emit('message_edited', {'messageId': messageId, 'content': message.content}, room=message.room)
        return jsonify({'JabberMessages': 'Message edited successfully.'}), 200

    return jsonify({'JabberMessages': 'Invalid option.'}), 400


# Message routes and controllers
@app.route('/api/messages/<room>', methods=['GET'])
def get_messages(room):
    print(room, 'NOMBREEEEE DE LA SALAAAAAAAAAAAAAAAAA')
    messages = JabberMessages.query.filter_by(room=room).order_by(JabberMessages.timestamp.asc()).limit(50).all()
    messages_json = [{"username": jabberusers.query.filter_by(id=msg.sender_id).first().username, "senderId": msg.sender_id, "content": msg.content, "timestamp": msg.timestamp, "messageid" : msg.id} for msg in messages]
    return jsonify(messages_json)

#SOCKET IO
@socketio.on('join')
def handle_join(data):
    room = data['currentRoom']
    userId = data['userId']
    if userId:
        join_room(room)
        print(f"{userId} has entered the room {room}")
    else:
        print("Error: User not logged in.")

@socketio.on('leave')
def handle_leave(data):
    room = data['currentRoom']
    username = data['username']
    if username:
        leave_room(room)
        send(f"{username} has left the room.", room=room)
    else:
        send("Error: User not logged in.", room=room)

@socketio.on('message')
def handle_message(data):
    room = data['currentRoom']
    message_content = data['message']
    userId = data['userId']
    print(message_content)
    if userId:
        users_in_room = socketio.server.manager.rooms['/'].get(room, set())
        users_list = list(users_in_room)
        print("my socket", )
        print('mensaje enviado',room, "USUARIOS EN LA SALA", users_list)

        user = jabberusers.query.filter_by(id=userId).first()
        if user is None:
            send({'JabberMessages': 'User not found.'}, room=room)
        message = JabberMessages(content=message_content, sender_id=userId, room=room)
        db.session.add(message)
        db.session.commit()
        # Obtener la representación serializable del timestamp
        timestamp_isoformat = message.timestamp.isoformat()
        emit('message',{"username": user.username, "senderId": message.sender_id, "content": message_content, "timestamp": timestamp_isoformat,"messageid" : message.id,  "room": room}, room=room,  broadcast=True)
    else:
        print({'JabberMessages': 'Username not found in session.'},room)

with app.app_context():
    db.create_all()
    
if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port=10000, debug=True)