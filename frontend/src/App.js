import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import SecureForm from './pages/SecureForm';
import InsecureForm from './pages/InsecureForm';

function App() {
  return (
    <Router>
      <Routes>
        {/* 根路径跳到登录 */}
        <Route path="/" element={<Navigate to="login" replace />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="home" element={<Home />} />

        {/* 新增两个页面路由 */}
        <Route path="secure-form" element={<SecureForm />} />
        <Route path="insecure-form" element={<InsecureForm />} />

        {/* 兜底重定向到登录页 */}
        <Route path="*" element={<Navigate to="login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
