import os
import time
import datetime
import hashlib
from flask_session import Session
from datetime import timedelta
from flask import Flask,  session, jsonify, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO, join_room, leave_room, send
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__, static_folder='../build', static_url_path='/')

mysql_Users = 'root'
mysql_password = ''
mysql_host = 'localhost'
mysql_port = 3306
mysql_db = 'jabber'
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+mysqlconnector://{mysql_Users}:{mysql_password}@{mysql_host}:{mysql_port}/{mysql_db}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Disable SQLAlchemy modification tracking
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SECRET_KEY'] = 'supersecretkey'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=20000)

Session(app)
socketio = SocketIO(app, cors_allowed_origins="*")

db = SQLAlchemy(app)
CORS(app, supports_credentials=True, origins=['http://localhost:5173'])  # Allowing CORS requests from the frontend

# Users model definition
class Users(db.Model):
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
        return f'<Users {self.username}>'

    def check_password(self, password):
        result = check_password_hash(self.password_hash, password)
        print(f'Checking password for {self.username}: {result} - {self.password_hash} - {password}')  # Debug print
        return result

# Message model definition
class Messages(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('users.id'),  nullable=True)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.datetime.utcnow, nullable=False)
    room = db.Column(db.String(100), default=0, nullable=True)

    def __repr__(self):
        return f'<Messages {self.id}>'

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
def logout():
    session.clear()
    return jsonify({"message": "Logged out!"})

#get session
@app.route('/api/getsession', methods=['GET'])
def get_session():
    return jsonify({"session": session})


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
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    # Check if the user already exists
    if Users.query.filter_by(username=username).first() or Users.query.filter_by(email=email).first():
        return jsonify({'Messages': 'User already exists.'}), 400

    # Create a new user
    new_user = Users(username=username, email=email)
    new_user.password = password  # Use the password setter to hash the password
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'Messages': 'User registered successfully.'}), 201

# Login endpoint
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Find the user in the database by username
    user = Users.query.filter_by(username=username).first()

    # Check if the user exists and if the password is correct
    if user and user.check_password(password):
        session['username'] = user.username
        session['email'] = user.email
        return jsonify({'Messages': 'Login successful.'}), 200
    else:
        return jsonify({'Messages': 'Incorrect username or password.'}), 400

# User profile endpoint
@app.route('/api/profile/<username>', methods=['GET', 'POST'])
def profile(username):
    if request.method == 'GET':
        user = Users.query.filter_by(username=username).first()
        if not user:
            return jsonify({'Messages': 'User not found.'}), 404
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
        user = Users.query.filter_by(username=username).first()
        if not user:
            return jsonify({'Messages': 'User not found.'}), 404
        
        # Update profile fields
        user.location = data.get('location', user.location)
        user.languages = data.get('languages', user.languages)
        db.session.commit()
        return jsonify({'Messages': 'Profile updated successfully.'}), 200

# Message routes and controllers
@app.route('/api/messages/<room>', methods=['GET'])
def get_messages(room):
    print(room, 'NOMBREEEEE DE LA SALAAAAAAAAAAAAAAAAA')
    messages = Messages.query.filter_by(room=room).order_by(Messages.timestamp.asc()).all()
    messages_json = [{"username": Users.query.filter_by(id=msg.sender_id).first().username, "content": msg.content, "timestamp": msg.timestamp} for msg in messages]
    return jsonify(messages_json)
    

# @app.route('/api/messages', methods=['POST'])
# def send_message():





#     data = request.get_json()
#     sender_id = data.get('sender_id')
#     receiver_id = data.get('receiver_id')
#     content = data.get('content')

#     # Create a new message
#     new_message = Messages(sender_id=sender_id, receiver_id=receiver_id, content=content)
#     db.session.add(new_message)
#     db.session.commit()

#     return jsonify({'Messages': 'Message sent successfully.'}), 201

#SOCKET IO
@socketio.on('join')
def handle_join(data):
    room = data['currentRoom']
    join_room(room)
    send(f"{session['username']} has entered the room.", room=room)

@socketio.on('leave')
def handle_leave(data):
    room = data['currentRoom']
    leave_room(room)
    send(f"{session['user']} has left the room.", room=room)

@socketio.on('message')
def handle_message(data):
    room = data['currentRoom']
    message_content = data['message']
    username = session.get('username')
    print(message_content)
    if username:
        print('entre al if')
        username_id = Users.query.filter_by(username=username).first().id
        print(username_id)

        if username_id is None:
            return jsonify({'Messages': 'User not found.'}), 404
        message = Messages(content=message_content, sender_id=username_id, room=room)
        db.session.add(message)
        db.session.commit()
        # Obtener la representación serializable del timestamp
        timestamp_isoformat = message.timestamp.isoformat()
        send({"username": username, "content": message_content, "timestamp": timestamp_isoformat, "room": room}, room=room)

if __name__ == '__main__':
    app.run(debug=True)

if __name__ == '__main__':
    socketio.run(app, debug=True)
