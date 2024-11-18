import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO
from flask_session import Session
from flask_cors import CORS
from app.config import Config
from dotenv import load_dotenv

load_dotenv()

# Inicialización de extensiones
db = SQLAlchemy()
socketio = SocketIO(cors_allowed_origins=os.environ.get("origins", "http://localhost:5173"))

def create_app():
    app = Flask(__name__, static_folder='../build', static_url_path='/')
    app.config.from_object(Config)

    # Inicializar extensiones
    db.init_app(app)
    Session(app)
    CORS(app, supports_credentials=True, origins=[os.environ.get("origins", "http://localhost:5173")])
    socketio.init_app(app)

    # Registrar Blueprints
    from app.routes import main as main_blueprint
    app.register_blueprint(main_blueprint)

    # Conexión a la base de datos
    with app.app_context():
        from app.models import jabberusers, JabberMessages
        db.create_all()

    return app
