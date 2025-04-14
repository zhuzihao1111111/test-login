// frontend/src/pages/Login.js
import { Form, Input, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    fetch('/api/login', {  // 开发时使用本地地址，部署后需要替换为后端地址或通过 nginx 反向代理
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if(data.code === 200){
          // 登录成功后跳转到 home 页面
          navigate('/home');
        } else {
          alert(data.message || '登录失败');
        }
      })
      .catch(err => {
        setLoading(false);
        alert('网络错误');
      });
  };

  return (
    <div style={{ maxWidth: 300, margin: '50px auto' }}>
      <h2>登录</h2>
      <Form name="login" onFinish={onFinish}>
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
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            登录
          </Button>
        </Form.Item>
      </Form>
      <div>
        还没有账号？ <Link to="/register">注册</Link>
      </div>
    </div>
  );
}

export default Login;
