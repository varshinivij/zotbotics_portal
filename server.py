from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)
DB_NAME = 'users.csv'

class User:
    def __init__(self, user_id, password):
        self.user_id = user_id
        self.password = password

# --- DB Setup on app start ---
def init_db():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            user_id INTEGER PRIMARY KEY NOT NULL UNIQUE,
            password TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# --- Core Logic ---
def insert_user(user: User):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    with conn:
        c.execute("INSERT INTO users (user_id, password) VALUES (?, ?)", (user.user_id, user.password))

def find_user(user: User):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    with conn:
        c.execute("SELECT * FROM users WHERE user_id = ? AND password = ?", (user.user_id, user.password))
        return c.fetchone()

def remove_user(user: User):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    with conn:
        c.execute("DELETE FROM users WHERE user_id = ?", (user.user_id,))

# --- API Routes ---

@app.route('/insert', methods=['POST'])
def insert_route():
    data = request.json
    user = User(data['user_id'], data['password'])
    try:
        insert_user(user)
        return jsonify({'message': 'User inserted'}), 201
    except sqlite3.IntegrityError:
        return jsonify({'message': 'User already exists'}), 409

@app.route('/find', methods=['POST'])
def find_route():
    data = request.json
    user = User(data['user_id'], data['password'])
    result = find_user(user)
    if result:
        return jsonify({'message': 'User found'}), 200
    return jsonify({'message': 'User not found'}), 404

@app.route('/remove', methods=['POST'])
def remove_route():
    data = request.json
    user = User(data['user_id'], data['password'])
    remove_user(user)
    return jsonify({'message': 'User removed'}), 200

if __name__ == '__main__':
    app.run(debug=True)
