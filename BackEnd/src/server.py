import os
import time
import datetime
from datetime import datetime
from flask import Flask, jsonify, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__, static_folder='../build', static_url_path='/')

mysql_user = 'root'
mysql_password = ''
mysql_host = 'localhost'
mysql_db = 'jabber'
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+mysqlconnector://{mysql_user}:{mysql_password}@{mysql_host}/{mysql_db}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Para deshabilitar la característica de seguimiento de modificaciones de SQLAlchemy

db = SQLAlchemy(app)
CORS(app)  # Allowing CORS requests from the frontend


# User model definition
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    location = db.Column(db.String(100))  # Campo para la ubicación del usuario
    languages = db.Column(db.String(200))  # Campo para los idiomas del usuario
    password_hash = db.Column(db.String(128))  # Campo para el hash de la contraseña

    def __repr__(self):
        return f'<User {self.username}>'

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

# Definición del modelo de Mensaje
class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f'<Message {self.id}>'

    def serialize(self):
        return {
            'id': self.id,
            'sender_id': self.sender_id,
            'receiver_id': self.receiver_id,
            'content': self.content,
            'timestamp': self.timestamp.isoformat(),
        }   

# Ruta absoluta al directorio del frontend (hermano de Backend)
frontend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'FrontEnd'))

# Configuración de la ruta estática para el frontend
@app.route('/')
def index():
    return send_from_directory(frontend_dir, 'index.html')

# Manejo de errores 404
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
    password = data.get('password')  # Expecting password from the frontend

    # Check if the user already exists
    if User.query.filter_by(username=username).first() or User.query.filter_by(email=email).first():
        return jsonify({'message': 'User already exists.'}), 400

    # Create a new user
    new_user = User(username=username, email=email)
    new_user.set_password(password)  # Hash the password before storing it in the database
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully.'}), 201

# Login endpoint
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Find the user in the database by username
    user = User.query.filter_by(username=username).first()

    # Check if the user exists and if the password is correct
    if user and user.check_password(password):
        return jsonify({'message': 'Login successful.'}), 200
    else:
        return jsonify({'message': 'Incorrect username or password.'}), 401

# User profile endpoint
@app.route('/api/profile/<username>', methods=['GET', 'POST'])
def profile(username):
    if request.method == 'GET':
        user = User.query.filter_by(username=username).first()
        if not user:
            return jsonify({'message': 'User not found.'}), 404
        # Return user profile data (excluding sensitive information)
        return jsonify({
            'username': user.username,
            'email': user.email,
            'location': user.location,
            'languages': user.languages,
            # Add more fields as needed
        })

    elif request.method == 'POST':
        # Update user profile data
        data = request.get_json()
        user = User.query.filter_by(username=username).first()
        if not user:
            return jsonify({'message': 'User not found.'}), 404
        
        # Update profile fields
        user.location = data.get('location', user.location)
        user.languages = data.get('languages', user.languages)
        # Add more fields to update as needed
        
        db.session.commit()
        return jsonify({'message': 'Profile updated successfully.'}), 200
    
# Rutas y controladores de mensajes
@app.route('/api/messages', methods=['GET'])
def get_messages():
    messages = Message.query.all()
    return jsonify([message.serialize() for message in messages])

@app.route('/api/messages', methods=['POST'])
def send_message():
    data = request.get_json()
    sender_id = data.get('sender_id')
    receiver_id = data.get('receiver_id')
    content = data.get('content')

    # Crear un nuevo mensaje
    new_message = Message(sender_id=sender_id, receiver_id=receiver_id, content=content)
    db.session.add(new_message)
    db.session.commit()

    return jsonify({'message': 'Message sent successfully.'}), 201


if __name__ == '__main__':
    app.run(debug=True)
