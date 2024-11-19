import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";

import QuestionPage from "./pages/QuestionPage";
import QuestionPackage from "./pages/QuestionPackage";
import InterviewList from "./pages/InterviewAdminPage";
import CandidateVideoPage from "./pages/CandidateVideoPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Home />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/questionsList" element={<QuestionPage />} />
        <Route path="/question-package" element={<QuestionPackage />} />
        <Route path="/interview" element={<InterviewList />} />
        <Route path="/interview/:interviewId/candidates" element={<CandidateVideoPage />} />
        <Route path="*" element={<NotFound />} /> {/* 404 sayfası */}
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </BrowserRouter>
  );
}

export default App;