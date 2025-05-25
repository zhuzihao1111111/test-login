from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_wtf.csrf import CSRFProtect, generate_csrf
import sqlite3
import os
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'  # CSRF 所需密钥
CORS(app, supports_credentials=True)

# 全局启用 CSRF 保护
csrf = CSRFProtect(app)

# 数据库路径
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE = os.path.join(BASE_DIR, 'users.db')

def init_db():
    if not os.path.exists(DATABASE):
        with sqlite3.connect(DATABASE) as conn:
            conn.cursor().execute('''
                CREATE TABLE users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT NOT NULL UNIQUE,
                    password TEXT NOT NULL
                )
            ''')
            conn.commit()

init_db()

# 在每次响应后注入新的 CSRF token 到 cookie
@app.after_request
def set_csrf_cookie(response):
    response.set_cookie('csrf_token', generate_csrf())
    return response

# —— 注册（免 CSRF） —— #
@csrf.exempt
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    u = data.get('username')
    p = data.get('password')
    if not u or not p:
        return jsonify({'code':400,'message':'缺少用户名或密码'}),400
    try:
        hp = generate_password_hash(p)
        with sqlite3.connect(DATABASE) as conn:
            conn.cursor().execute(
                "INSERT INTO users(username,password) VALUES(?,?)", (u,hp)
            )
            conn.commit()
        return jsonify({'code':200,'message':'注册成功'})
    except sqlite3.IntegrityError:
        return jsonify({'code':400,'message':'用户名已存在'}),400
    except Exception as e:
        return jsonify({'code':500,'message':str(e)}),500

# —— 登录（免 CSRF） —— #
@csrf.exempt
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    u = data.get('username')
    p = data.get('password')
    if not u or not p:
        return jsonify({'code':400,'message':'缺少用户名或密码'}),400
    try:
        with sqlite3.connect(DATABASE) as conn:
            cur = conn.cursor()
            cur.execute("SELECT password FROM users WHERE username=?", (u,))
            row = cur.fetchone()
        if not row or not check_password_hash(row[0], p):
            return jsonify({'code':400,'message':'用户名或密码错误'}),400
        return jsonify({'code':200,'message':'登录成功'})
    except Exception as e:
        return jsonify({'code':500,'message':str(e)}),500

# —— 健康检查 —— #
@app.route('/api/status', methods=['GET'])
def health_check():
    return jsonify({'status':'ok'}), 200

# —— CSRF 同步令牌模式：获取一次性令牌 —— #
@app.route('/api/get-csrf-token', methods=['GET'])
def get_csrf_token():
    # generate_csrf 会生成新 token 并写入 session
    token = generate_csrf()
    return jsonify({'csrf_token': token})

# —— CSRF 同步令牌模式提交接口（受 CSRFProtect 保护） —— #
@app.route('/api/sync-submit', methods=['POST'])
def sync_submit():
    # CSRFProtect 会自动校验 body 中的 csrf_token
    data = request.get_json()
    return jsonify({'message': f'✅ 同步令牌接收: {data.get("data")}'})

# —— CSRF 双重提交 Cookie 模式 —— #
@app.route("/api/secure-submit", methods=["POST"])
def secure_submit():
    # CSRFProtect 会校验 header 中 X-CSRFToken 与 cookie 中 csrf_token
    data = request.get_json()
    print("✅ Secure data received:", data)
    return jsonify({"message": f"✅ Protected data received: {data.get('data')}"})

# —— 不启用 CSRF 校验 —— #
@csrf.exempt
@app.route("/api/insecure-submit", methods=["POST"])
def insecure_submit():
    data = request.get_json()
    print("⚠️ Insecure data received:", data)
    return jsonify({"message": f"⚠️ Insecure data received: {data.get('data')}"})

# —— 来源校验模式 —— #
@csrf.exempt
@app.route('/api/referer-submit', methods=['POST'])
def referer_submit():
    origin = request.headers.get('Origin') or request.headers.get('Referer','')
    if not origin.startswith('http://www.zhuzihao.xin'):
        return jsonify({'message':'Invalid referer/origin'}),403
    data = request.get_json()
    return jsonify({'message': f'✅ 来源校验接收: {data.get("data")}'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
