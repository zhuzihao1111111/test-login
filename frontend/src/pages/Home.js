// frontend/src/pages/Home.js
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
        {/* 原有 CSRF 双重提交示例 */}
        <Button type="primary" onClick={() => navigate('/secure-form')}>
          跳转到防御 CSRF 的页面
        </Button>
        <Button danger onClick={() => navigate('/insecure-form')}>
          跳转到不防御 CSRF 的页面
        </Button>

        {/* 新增：同步令牌模式示例 */}
        <Button onClick={() => navigate('/sync-form')}>
          同步令牌 CSRF 页面
        </Button>

        {/* 新增：Referer/Origin 校验示例 */}
        <Button onClick={() => navigate('/referer-form')}>
          Referer 校验 页面
        </Button>

        {/* 退出登录 */}
        <Button onClick={handleLogout}>退出登录</Button>
      </Space>
    </div>
  );
}
