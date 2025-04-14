// frontend/src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        {/* 未匹配到的路径默认跳转到登录 */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
