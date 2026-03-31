import { useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Smartphone, ShieldCheck, User, Mail, MapPin } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "", // Changed from phone
    address: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔥 Handle input change with digit limiting
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Mobile number logic: only digits, max 10
    if (name === "mobile") {
      const onlyNums = value.replace(/[^0-9]/g, "");
      if (onlyNums.length <= 10) {
        setData({ ...data, [name]: onlyNums });
      }
      return;
    }

    setData({ ...data, [name]: value });
  };

  // 🚀 Register API call
  const register = async () => {
    // 📧 EMAIL VALIDATION
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      toast.error("Please enter a valid email address! ✉️");
      return;
    }

    // 🛡️ FRONTEND VALIDATION
    if (data.password.length < 8 || data.password.length > 20) {
      toast.error("Password must be between 8 and 20 characters! 🛡️");
      return;
    }

    if (data.mobile.length !== 10) {
      toast.error("Mobile number must be exactly 10 digits! 📱");
      return;
    }

    if (!data.name || !data.email || !data.address) {
      toast.error("Please fill in all details! 📝");
      return;
    }

    try {
      setLoading(true);

      // Map 'mobile' back to 'phone' if the backend expects 'phone'
      // Based on previous file content, backend DTO might use 'phone'
      const payload = { ...data, phone: data.mobile };
      delete payload.mobile;

      await API.post("/api/auth/register", payload);

      toast.success("Account Created Successfully! 🎉");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed. Check if email/phone exists.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      
      {/* 🔥 LEFT SIDE (HD IMAGE LAYER) */}
      <div className="auth-left">
        <motion.div
           initial={{ opacity: 0, x: -50 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8 }}
        >
          <h1>Join the Global<br/>Knowledge Hub</h1>
          <p>
            Register an account today to start borrowing premium books from our exclusive 
            digital collections. Access thousands of titles instantly.
          </p>
        </motion.div>
      </div>

      {/* 🔐 RIGHT SIDE CONTAINER */}
      <div className="auth-right">
        <motion.div 
          className="auth-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div style={{ textAlign: 'center', marginBottom: '25px' }}>
             <ShieldCheck size={50} color="#38bdf8" style={{ marginBottom: '10px' }}/>
             <h2 style={{ margin: 0 }}>Register Account</h2>
          </div>

          <div className="form-group">
            <label><User size={14} style={{ marginRight: '5px'}}/> Full Name</label>
            <input
              name="name"
              placeholder="e.g. John Doe"
              value={data.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label><Mail size={14} style={{ marginRight: '5px'}}/> Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="name@example.com"
              value={data.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group" style={{ position: 'relative' }}>
            <label><ShieldCheck size={14} style={{ marginRight: '5px'}}/> Secure Password (8-20 chars)</label>
            <div style={{ position: 'relative' }}>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={data.password}
                onChange={handleChange}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ 
                  position: 'absolute', 
                  right: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  width: 'auto',
                  padding: '5px'
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label><Smartphone size={14} style={{ marginRight: '5px'}}/> Mobile Number <span style={{fontSize: '10px', color: '#6366f1'}}>(Only numbers, max 10)</span></label>
            <input
              name="mobile"
              placeholder="9876543210"
              value={data.mobile}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label><MapPin size={14} style={{ marginRight: '5px'}}/> Home Address</label>
            <input
              name="address"
              placeholder="Enter Street, City, ZIP..."
              value={data.address}
              onChange={handleChange}
            />
          </div>

          <button
            className="btn"
            onClick={register}
            disabled={loading}
            style={{ marginTop: '15px' }}
          >
            {loading ? "Constructing Account..." : "Create Account"}
          </button>
          
          <p className="auth-switch">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>
              Login Here
            </span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}