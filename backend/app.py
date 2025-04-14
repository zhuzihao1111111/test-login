# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)  # 开启跨域支持

# 设置数据库文件的绝对路径，确保在任何环境下都能正确定位
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE = os.path.join(BASE_DIR, 'users.db')

def init_db():
    # 如果数据库不存在则创建，并建立 users 表
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

@app.route('/api/register', methods=['POST'])
def register():
    """
    用户注册接口：
    - 接受 JSON 格式数据，要求包含 username 和 password 字段。
    - 密码将通过 generate_password_hash 生成哈希后存储。
    """
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'code': 400, 'message': '缺少用户名或密码'})
    
    try:
        # 使用 Werkzeug 对密码进行哈希处理
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

@app.route('/api/login', methods=['POST'])
def login():
    """
    用户登录接口：
    - 接受 JSON 格式数据，要求包含 username 和 password 字段。
    - 根据用户名查找用户，并使用 check_password_hash 来验证密码是否正确。
    """
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
    # 开发模式下运行，生产环境推荐使用 WSGI 服务器如 Gunicorn、uWSGI 部署
    app.run(host='0.0.0.0', port=5000, debug=True)
