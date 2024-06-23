from app import app, db, Users, Messages  # Importa tu app y modelos desde tu módulo

@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'Users': Users, 'Messages': Messages}
