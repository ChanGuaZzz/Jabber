import os
from datetime import timedelta
from sqlalchemy.pool import QueuePool

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'fallback_secret_key')
    SQLALCHEMY_DATABASE_URI = (
        f"mysql+mysqlconnector://{os.environ.get('mysql_user', 'root')}:"
        f"{os.environ.get('mysql_password', '')}@"
        f"{os.environ.get('mysql_host', 'localhost')}:"
        f"{os.environ.get('mysql_port', 3306)}/"
        f"{os.environ.get('mysql_db', 'jabber')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SESSION_TYPE = 'filesystem'
    SESSION_COOKIE_SAMESITE = "None"
    SESSION_COOKIE_SECURE = True
    PERMANENT_SESSION_LIFETIME = timedelta(minutes=20000)
    SQLALCHEMY_ENGINE_OPTIONS = {
        'poolclass': QueuePool,
        'pool_size': 10,
        'max_overflow': 20,
        'pool_timeout': 30,
        'pool_recycle': 1800,
        'pool_pre_ping': True,
    }
