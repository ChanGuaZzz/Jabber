from flask import Blueprint, request, jsonify, session
from flask_cors import cross_origin
from app.models import db, jabberusers, JabberMessages
from sqlalchemy.exc import IntegrityError, OperationalError

main = Blueprint('main', __name__)

@main.route('/api/register', methods=['POST'])
@cross_origin(supports_credentials=True)
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'error': 'Missing fields'}), 400

    try:
        new_user = jabberusers(username=username, email=email)
        new_user.password = password
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User registered successfully.'}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': 'User already exists.'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Server error. Please try again later.'}), 500

@main.route('/api/login', methods=['POST'])
@cross_origin(supports_credentials=True)
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = jabberusers.query.filter_by(username=username).first()
    if user and user.check_password(password):
        session['username'] = user.username
        session['email'] = user.email
        session.modified = True
        return jsonify({'message': 'Login successful.'}), 200
    return jsonify({'error': 'Invalid credentials.'}), 400
