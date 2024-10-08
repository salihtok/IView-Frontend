import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import NotFound from './pages/NotFound'; // NotFound bileşenini içe aktarıyoruz

import QuestionPage from './pages/QuestionPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Home />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/question" element={<QuestionPage />} />
        <Route path="*" element={<NotFound />} /> {/* 404 sayfası */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;