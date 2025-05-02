// frontend/src/pages/Login.js
import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';  // 新增

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await axios.post(
        '/api/login',
        values,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      );
      if (res.data.code === 200) {
        message.success('登录成功');
        navigate('/home');
      } else {
        message.error(res.data.message || '登录失败');
      }
    } catch (err) {
      message.error('网络错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 300, margin: '50px auto' }}>
      <h2>登录</h2>
      <Form name="login" onFinish={onFinish} layout="vertical">
        <Form.Item name="username" rules={[{ required: true, message: '请输入用户名!' }]}>
          <Input placeholder="用户名" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: '请输入密码!' }]}>
          <Input.Password placeholder="密码" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            登录
          </Button>
        </Form.Item>
      </Form>
      <div style={{ textAlign: 'center' }}>
        还没有账号？ <Link to="/register">注册</Link>
      </div>
    </div>
  );
}
