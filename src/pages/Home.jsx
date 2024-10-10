import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/admin-login");
  }, [navigate]);

  return (
    <div>
      <h1>Yönlendiriliyor...</h1>
      <p>Lütfen bekleyin.</p>
    </div>
  );
};

export default Home;