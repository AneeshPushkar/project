import { useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login() {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const login = async () => {
    // 📧 EMAIL VALIDATION
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      toast.error("Please enter a valid email address! ✉️");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/api/auth/login", data);

      const d = res.data.data;

      localStorage.setItem("token", d.token);
      localStorage.setItem("role", d.role);

      localStorage.setItem("user", JSON.stringify({
        id: d.id,
        name: d.name,
        email: d.email
      }));

      toast.success("Login Success 🚀");

      navigate("/");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Login Failed ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">

      {/* 🔥 LEFT SIDE (HD IMAGE LAYER) */}
      <motion.div
        className="auth-left"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1>Welcome to the<br/>Future of Reading</h1>
        <p>
          Immerse yourself in our premium digital library. Manage your books,
          track checkouts, and discover infinite knowledge inside a powerful interface.
        </p>
      </motion.div>

      {/* 🔐 RIGHT SIDE CONTAINER */}
      <div className="auth-right">
        <motion.div
          className="auth-card"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2>🔐 Login</h2>

          <input
            type="email"
            placeholder="Enter Email"
            value={data.email}
            onChange={(e) =>
              setData({ ...data, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={data.password}
            onChange={(e) =>
              setData({ ...data, password: e.target.value })
            }
          />

          <button className="btn" onClick={login} disabled={loading} style={{marginTop: '15px'}}>
            {loading ? "Logging in..." : "Login to Portal"}
          </button>

          <p className="auth-switch">
            Don't have an account?{" "}
            <span onClick={() => navigate("/register")}>
              Register Here
            </span>
          </p>
        </motion.div>
      </div>

    </div>
  );
}