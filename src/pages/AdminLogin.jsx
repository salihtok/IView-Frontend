import { useState } from "react";
import { loginAdmin } from "../services/authServices";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await loginAdmin(email, password);
    if (!success) {
      setError("Login failed, please check your credentials.");
    } else {
      navigate("/questionsList");
    }
  };

  return (
    <div className="flex justify-between items-center min-h-screen relative bg-[rgb(240,250,249)]">
      {/* Login Container */}
      <div className="bg-[rgb(240,250,249)] p-12 rounded-lg shadow-md w-2/6 mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src="/logo.svg"
            alt="Company Logo"
            className="h-12 w-auto"
          />
        </div>
        
        <h2 className="text-2xl font-semibold text-gray-700 mb-8">
          Admin Log in Page
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-gray-700 text-white rounded-md hover:bg-gray-900 transition-colors"
          >
            Log in
          </button>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;