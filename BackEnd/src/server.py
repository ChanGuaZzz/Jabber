import os
import time
import datetime
from datetime import datetime
from flask import Flask, jsonify, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__, static_folder='../build', static_url_path='/')

mysql_Users = 'root'
mysql_password = ''
mysql_host = 'localhost'
mysql_db = 'jabber'
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+mysqlconnector://{mysql_Users}:{mysql_password}@{mysql_host}/{mysql_db}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Para deshabilitar la característica de seguimiento de modificaciones de SQLAlchemy

db = SQLAlchemy(app)
CORS(app)  # Allowing CORS requests from the frontend


# Users model definition
class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    Username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    location = db.Column(db.String(100))  # Campo para la ubicación del usuario
    languages = db.Column(db.String(200))  # Campo para los idiomas del usuario
    password_hash = db.Column(db.String(128))  # Campo para el hash de la contraseña

    def __repr__(self):
        return f'<Users {self.Username}>'

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

# Definición del modelo de Mensaje
class Messages(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('Users.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('Users.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

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
    Username = data.get('username')
    email = data.get('email')
    password = data.get('password')  # Expecting password from the frontend

    # Check if the Users already exists
    if Users.query.filter_by(Username=Username).first() or Users.query.filter_by(email=email).first():
        return jsonify({'Messages': 'Users already exists.'}), 400

    # Create a new Users
    new_Users = Users(Username=Username, email=email)
    new_Users.set_password(password)  # Hash the password before storing it in the database
    # Add the new Users to the database VVVVVVVVVV
    db.session.add(new_Users)
    db.session.commit()

    return jsonify({'Messages': 'Users registered successfully.'}), 201

# Login endpoint
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    Username = data.get('Username')
    password = data.get('password')

    # Find the Users in the database by Username
    Users = Users.query.filter_by(Username=Username).first()

    # Check if the Users exists and if the password is correct
    if Users and Users.check_password(password):
        return jsonify({'Messages': 'Login successful.'}), 200
    else:
        return jsonify({'Messages': 'Incorrect Username or password.'}), 401

# Users profile endpoint
@app.route('/api/profile/<Username>', methods=['GET', 'POST'])
def profile(Username):
    if request.method == 'GET':
        Users = Users.query.filter_by(Username=Username).first()
        if not Users:
            return jsonify({'Messages': 'Users not found.'}), 404
        # Return Users profile data (excluding sensitive information)
        return jsonify({
            'Username': Users.Username,
            'email': Users.email,
            'location': Users.location,
            'languages': Users.languages,
            # Add more fields as needed
        })

    elif request.method == 'POST':
        # Update Users profile data
        data = request.get_json()
        Users = Users.query.filter_by(Username=Username).first()
        if not Users:
            return jsonify({'Messages': 'Users not found.'}), 404
        
        # Update profile fields
        Users.location = data.get('location', Users.location)
        Users.languages = data.get('languages', Users.languages)
        # Add more fields to update as needed
        
        db.session.commit()
        return jsonify({'Messages': 'Profile updated successfully.'}), 200
    
# Rutas y controladores de mensajes
@app.route('/api/Messagess', methods=['GET'])
def get_Messagess():
    Messagess = Messages.query.all()
    return jsonify([Messages.serialize() for Messages in Messagess])

@app.route('/api/Messagess', methods=['POST'])
def send_Messages():
    data = request.get_json()
    sender_id = data.get('sender_id')
    receiver_id = data.get('receiver_id')
    content = data.get('content')

    # Crear un nuevo mensaje
    new_Messages = Messages(sender_id=sender_id, receiver_id=receiver_id, content=content)
    db.session.add(new_Messages)
    db.session.commit()

    return jsonify({'Messages': 'Messages sent successfully.'}), 201


if __name__ == '__main__':
    app.run(debug=True)
