// frontend/src/pages/Register.js
import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';  // 新增

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    if (values.password !== values.confirm) {
      message.error('两次输入密码不一致');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        '/api/register',
        { username: values.username, password: values.password },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      );
      if (res.data.code === 200) {
        message.success('注册成功，即将跳转登录');
        setTimeout(() => navigate('/login'), 1000);
      } else {
        message.error(res.data.message || '注册失败');
      }
    } catch (err) {
      message.error('网络错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 300, margin: '50px auto' }}>
      <h2>注册</h2>
      <Form name="register" onFinish={onFinish} layout="vertical">
        <Form.Item name="username" rules={[{ required: true, message: '请输入用户名!' }]}>
          <Input placeholder="用户名" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: '请输入密码!' }]}>
          <Input.Password placeholder="密码" />
        </Form.Item>
        <Form.Item name="confirm" rules={[{ required: true, message: '请确认密码!' }]}>
          <Input.Password placeholder="确认密码" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            注册
          </Button>
        </Form.Item>
      </Form>
      <div style={{ textAlign: 'center' }}>
        已有账号？ <Link to="/login">登录</Link>
      </div>
    </div>
  );
}
