// frontend/src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login                    from './pages/Login';
import Register                 from './pages/Register';
import Home                     from './pages/Home';
import SecureForm               from './pages/SecureForm';
import InsecureForm             from './pages/InsecureForm';

// 新增导入
import SynchronizerTokenForm    from './pages/SynchronizerTokenForm';
import RefererCheckForm         from './pages/RefererCheckForm';

function App() {
  return (
    <Router>
      <Routes>
        {/* 根路径跳到登录 */}
        <Route path="/" element={<Navigate to="login" replace />} />

        <Route path="login"    element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="home"     element={<Home />} />

        {/* 原有 CSRF 演示页面 */}
        <Route path="secure-form"   element={<SecureForm />} />
        <Route path="insecure-form" element={<InsecureForm />} />

        {/* 新增同步令牌模式页面 */}
        <Route path="sync-form"     element={<SynchronizerTokenForm />} />

        {/* 新增来源校验模式页面 */}
        <Route path="referer-form"  element={<RefererCheckForm />} />

        {/* 兜底重定向到登录页 */}
        <Route path="*" element={<Navigate to="login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
