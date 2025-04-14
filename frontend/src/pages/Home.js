// frontend/src/pages/Home.js
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 退出登录时，仅在前端清理状态，转回登录页面
    navigate('/login');
  };

  return (
    <div style={{ padding: 50, textAlign: 'center' }}>
      <h2>欢迎来到主页</h2>
      <Button onClick={handleLogout}>退出登录</Button>
    </div>
  );
}

export default Home;
