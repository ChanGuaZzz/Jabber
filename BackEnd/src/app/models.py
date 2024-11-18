from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import datetime

db = SQLAlchemy()

# Modelo de Usuarios
class jabberusers(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False, index=True)
    email = db.Column(db.String(100), unique=True, nullable=False, index=True)
    location = db.Column(db.String(100))
    languages = db.Column(db.String(200))
    password_hash = db.Column(db.String(128))

    @property
    def password(self):
        raise AttributeError("Password is not a readable attribute")

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password, 'pbkdf2')

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

# Modelo de Mensajes
class JabberMessages(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('jabberusers.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('jabberusers.id'), nullable=True)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.datetime.utcnow, nullable=False)
    room = db.Column(db.String(100), nullable=True)
