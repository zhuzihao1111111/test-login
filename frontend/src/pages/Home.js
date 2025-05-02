import React from 'react';
import { Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div style={{ padding: 50, textAlign: 'center' }}>
      <h2>欢迎来到主页</h2>
      <Space direction="vertical" size="large">
        <Button type="primary" onClick={() => navigate('/secure-form')}>
          跳转到防御 CSRF 的页面
        </Button>
        <Button danger onClick={() => navigate('/insecure-form')}>
          跳转到不防御 CSRF 的页面
        </Button>
        <Button onClick={handleLogout}>退出登录</Button>
      </Space>
    </div>
  );
}
