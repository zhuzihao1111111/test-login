import { Form, Input, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { API_BASE_URL } from '../config';  // ✅ 引入配置变量

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    if (values.password !== values.confirm) {
      alert("两次密码不一致");
      return;
    }

    setLoading(true);
    fetch(`${API_BASE_URL}/register`, {  // ✅ 使用配置变量拼接完整 URL
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: values.username, password: values.password })
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.code === 200) {
          alert('注册成功，请登录');
          navigate('/login');
        } else {
          alert(data.message || '注册失败');
        }
      })
      .catch(err => {
        setLoading(false);
        alert('网络错误');
      });
  };

  return (
    <div style={{ maxWidth: 300, margin: '50px auto' }}>
      <h2>注册</h2>
      <Form name="register" onFinish={onFinish}>
        <Form.Item
          name="username"
          rules={[{ required: true, message: '请输入用户名!' }]}
        >
          <Input placeholder="用户名" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: '请输入密码!' }]}
        >
          <Input.Password placeholder="密码" />
        </Form.Item>
        <Form.Item
          name="confirm"
          rules={[{ required: true, message: '请确认密码!' }]}
        >
          <Input.Password placeholder="确认密码" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            注册
          </Button>
        </Form.Item>
      </Form>
      <div>
        已有账号？ <Link to="/login">登录</Link>
      </div>
    </div>
  );
}

export default Register;
