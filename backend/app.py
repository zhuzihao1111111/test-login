from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE = os.path.join(BASE_DIR, 'users.db')

def init_db():
    if not os.path.exists(DATABASE):
        with sqlite3.connect(DATABASE) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                CREATE TABLE users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT NOT NULL UNIQUE,
                    password TEXT NOT NULL
                )
            ''')
            conn.commit()

init_db()

# ✅ 同时支持 /register 和 /api/register
@app.route('/register', methods=['POST'])
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'code': 400, 'message': '缺少用户名或密码'})
    
    try:
        hashed_password = generate_password_hash(password)
        with sqlite3.connect(DATABASE) as conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO users (username, password) VALUES (?, ?)",
                (username, hashed_password)
            )
            conn.commit()
        return jsonify({'code': 200, 'message': '注册成功'})
    except sqlite3.IntegrityError:
        return jsonify({'code': 400, 'message': '用户名已存在'})
    except Exception as e:
        return jsonify({'code': 500, 'message': str(e)})

# ✅ 同时支持 /login 和 /api/login
@app.route('/login', methods=['POST'])
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'code': 400, 'message': '缺少用户名或密码'})
    
    try:
        with sqlite3.connect(DATABASE) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id, username, password FROM users WHERE username = ?", (username,))
            user = cursor.fetchone()
        
        if user:
            _, _, stored_password = user
            if check_password_hash(stored_password, password):
                return jsonify({'code': 200, 'message': '登录成功'})
            else:
                return jsonify({'code': 400, 'message': '用户名或密码错误'})
        else:
            return jsonify({'code': 400, 'message': '用户名或密码错误'})
    except Exception as e:
        return jsonify({'code': 500, 'message': str(e)})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
