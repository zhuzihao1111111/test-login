from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_wtf.csrf import CSRFProtect, generate_csrf
import sqlite3
import os
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'  # 设置 CSRF 所需密钥
CORS(app, supports_credentials=True)

# 启用全局 CSRF 保护
csrf = CSRFProtect(app)

# 设置数据库路径
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE = os.path.join(BASE_DIR, 'users.db')

# 初始化数据库
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

# 自动设置 CSRF Token 到 Cookie，供前端读取
@app.after_request
def set_csrf_cookie(response):
    response.set_cookie('csrf_token', generate_csrf())
    return response

# ✅ 注册接口（不启用 CSRF 校验）
@csrf.exempt
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

# ✅ 登录接口（不启用 CSRF 校验）
@csrf.exempt
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
                response = jsonify({'code': 200, 'message': '登录成功'})
                return response
            else:
                return jsonify({'code': 400, 'message': '用户名或密码错误'})
        else:
            return jsonify({'code': 400, 'message': '用户名或密码错误'})
    except Exception as e:
        return jsonify({'code': 500, 'message': str(e)})

# ✅ 健康检查
@app.route('/api/status', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'}), 200

# ✅ 防御 CSRF 的表单提交接口（默认启用 CSRFProtect）
@app.route("/api/secure-submit", methods=["POST"])
def secure_submit():
    data = request.get_json()
    print("✅ Secure data received:", data)
    return jsonify({"message": f"✅ Protected data received: {data.get('data')}"})

# ❌ 不防御 CSRF 的表单提交接口（通过装饰器关闭）
@csrf.exempt
@app.route("/api/insecure-submit", methods=["POST"])
def insecure_submit():
    data = request.get_json()
    print("⚠️ Insecure data received:", data)
    return jsonify({"message": f"⚠️ Insecure data received: {data.get('data')}"})

# ✅ 启动服务（在开发模式使用；上线用 Gunicorn）
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
