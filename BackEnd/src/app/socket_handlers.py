from flask_socketio import join_room, leave_room, emit
from app import socketio, db
from app.models import jabberusers, JabberMessages

@socketio.on('join')
def handle_join(data):
    room = data.get('currentRoom')
    username = data.get('username')

    if not username or not room:
        return

    join_room(room)
    emit('message', {'message': f'{username} has joined the room.'}, room=room)

@socketio.on('message')
def handle_message(data):
    room = data.get('currentRoom')
    message_content = data.get('message')
    username = data.get('username')

    user = jabberusers.query.filter_by(username=username).first()
    if user:
        message = JabberMessages(content=message_content, sender_id=user.id, room=room)
        db.session.add(message)
        db.session.commit()
        emit('message', {
            'username': username,
            'content': message_content,
            'timestamp': message.timestamp.isoformat()
        }, room=room)
