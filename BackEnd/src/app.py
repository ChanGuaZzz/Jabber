import os
import time
import datetime
import hashlib
from flask_session import Session
from datetime import timedelta
from flask import Flask, session, jsonify, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO, join_room, leave_room, send
from flask_cors import CORS, cross_origin
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
from sqlalchemy.exc import OperationalError
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
    'pool_recycle': 1800,  # Reciclar conexiones cada 30 minutos
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
            'email': session['email']
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

    # Check if the user already exists
    if jabberusers.query.filter_by(username=username).first() or jabberusers.query.filter_by(email=email).first():
        return jsonify({'JabberMessages': 'User already exists.'}), 400

    # Create a new user
    new_user = jabberusers(username=username, email=email)
    new_user.password = password  # Use the password setter to hash the password
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'JabberMessages': 'User registered successfully.'}), 201

# Login endpoint
@app.route('/api/login', methods=['POST'])
@cross_origin(supports_credentials=True)
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Find the user in the database by username
    user = jabberusers.query.filter_by(username=username).first()

    # Check if the user exists and if the password is correct
    if user and user.check_password(password):
        session['username'] = user.username
        session['email'] = user.email
        session.modified = True
        return jsonify({'JabberMessages': 'Login successful.'}), 200
    else:
        return jsonify({'JabberMessages': 'Incorrect username or password.'}), 400

# User profile endpoint
@app.route('/api/profile/<username>', methods=['GET', 'POST'])
@cross_origin(supports_credentials=True)
def profile(username):
    if request.method == 'GET':
        user = jabberusers.query.filter_by(username=username).first()
        if not user:
            return jsonify({'JabberMessages': 'User not found.'}), 404
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
        user = jabberusers.query.filter_by(username=username).first()
        if not user:
            return jsonify({'JabberMessages': 'User not found.'}), 404
        
        # Update profile fields
        user.location = data.get('location', user.location)
        user.languages = data.get('languages', user.languages)
        db.session.commit()
        return jsonify({'JabberMessages': 'Profile updated successfully.'}), 200

# Message routes and controllers
@app.route('/api/messages/<room>', methods=['GET'])
def get_messages(room):
    print(room, 'NOMBREEEEE DE LA SALAAAAAAAAAAAAAAAAA')
    messages = JabberMessages.query.filter_by(room=room).order_by(JabberMessages.timestamp.asc()).all()
    messages_json = [{"username": jabberusers.query.filter_by(id=msg.sender_id).first().username, "content": msg.content, "timestamp": msg.timestamp, "messageid" : msg.id} for msg in messages]
    return jsonify(messages_json)

#SOCKET IO
@socketio.on('join')
def handle_join(data):
    room = data['currentRoom']
    join_room(room)
    print(session)
    send(f"{session.get("username")} has entered the room.", room=room)

@socketio.on('leave')
def handle_leave(data):
    room = data['currentRoom']
    leave_room(room)
    send(f"{session.get('username')} has left the room.", room=room)

@socketio.on('message')
@cross_origin(supports_credentials=True)
def handle_message(data):
    room = data['currentRoom']
    message_content = data['message']
    username = session.get('username')
    print(message_content)
    if username:
        print('entre al if')
        user = jabberusers.query.filter_by(username=username).first()
        if user is None:
            return jsonify({'JabberMessages': 'User not found.'}), 404
        message = JabberMessages(content=message_content, sender_id=user.id, room=room)
        db.session.add(message)
        db.session.commit()
        # Obtener la representación serializable del timestamp
        timestamp_isoformat = message.timestamp.isoformat()
        send({"username": username, "content": message_content, "timestamp": timestamp_isoformat, "room": room}, room=room)
    else:
        return jsonify({'JabberMessages': 'Username not found in session.'}), 400

with app.app_context():
    db.create_all()
    
if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port=10000, debug=True)