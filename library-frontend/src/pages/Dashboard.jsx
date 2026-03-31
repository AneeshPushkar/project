import { useEffect, useState } from "react";
import API from "../services/api";
import { motion } from "framer-motion";
import { Book, Users, BookOpenCheck, RotateCcw, BookMarked, Sparkles } from "lucide-react";
import { isAdmin } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [data, setData] = useState({
    totalBooks: 0,
    totalUsers: 0,
    totalIssued: 0,
    totalReturned: 0
  });

  const [userName, setUserName] = useState("Member");
  const navigate = useNavigate();

  useEffect(() => {
    // Load personalized user identity
    try {
      const userTxt = localStorage.getItem("user");
      if (userTxt) {
        const userObj = JSON.parse(userTxt);
        if (userObj.name) setUserName(userObj.name);
      }
    } catch(e) {}

    // ONLY fetch Admin statistics if the user is an admin
    if (isAdmin()) {
      API.get("/api/reports/dashboard")
        .then(res => setData(res.data.data))
        .catch((err) => console.log("Failed to load stats"));
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "tween", duration: 0.5 } }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      
      {/* 🔷 IMMERSIVE HERO HEADER */}
      <div className="hero-section" style={{ textAlign: "left", padding: "60px 50px" }}>
        <h1 style={{ fontSize: "42px", margin: "0 0 10px 0" }}>
          Welcome back, {userName} 👋
        </h1>
        <p style={{ margin: 0, maxWidth: "700px" }}>
          {isAdmin() 
            ? "Here is the live analytic overview of your premium digital library. Track book circulation, active members, and overall system health instantly."
            : "We're glad to see you again! Dive into our vast collection of books and discover your next favorite read in our library."}
        </p>
      </div>

      {/* 🔷 ADMIN ONLY: ANALYTICS GRID */}
      {isAdmin() && (
        <motion.div 
          className="grid" 
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* STAT 1: TOTAL BOOKS */}
          <motion.div variants={cardVariants} className="card" style={{ padding: "30px", borderTop: "4px solid #38bdf8" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
              <h4 style={{ margin: 0, color: "#94a3b8", fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>Total Catalog</h4>
              <div style={{ background: "rgba(56, 189, 248, 0.15)", padding: "12px", borderRadius: "12px", color: "#38bdf8" }}>
                <Book size={32} />
              </div>
            </div>
            <h1 style={{ margin: 0, fontSize: "48px", fontWeight: "700", color: "#fff" }}>
              {data.totalBooks}
            </h1>
          </motion.div>

          {/* STAT 2: TOTAL MEMBERS */}
          <motion.div variants={cardVariants} className="card" style={{ padding: "30px", borderTop: "4px solid #818cf8" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
              <h4 style={{ margin: 0, color: "#94a3b8", fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>Active Users</h4>
              <div style={{ background: "rgba(129, 140, 248, 0.15)", padding: "12px", borderRadius: "12px", color: "#818cf8" }}>
                <Users size={32} />
              </div>
            </div>
            <h1 style={{ margin: 0, fontSize: "48px", fontWeight: "700", color: "#fff" }}>
              {data.totalUsers}
            </h1>
          </motion.div>

          {/* STAT 3: TOTAL ISSUED */}
          <motion.div variants={cardVariants} className="card" style={{ padding: "30px", borderTop: "4px solid #f59e0b" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
              <h4 style={{ margin: 0, color: "#94a3b8", fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>Currently Issued</h4>
              <div style={{ background: "rgba(245, 158, 11, 0.15)", padding: "12px", borderRadius: "12px", color: "#f59e0b" }}>
                <BookOpenCheck size={32} />
              </div>
            </div>
            <h1 style={{ margin: 0, fontSize: "48px", fontWeight: "700", color: "#fff" }}>
              {data.totalIssued}
            </h1>
          </motion.div>

          {/* STAT 4: TOTAL RETURNED */}
          <motion.div variants={cardVariants} className="card" style={{ padding: "30px", borderTop: "4px solid #10b981" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
              <h4 style={{ margin: 0, color: "#94a3b8", fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>Total Returns</h4>
              <div style={{ background: "rgba(16, 185, 129, 0.15)", padding: "12px", borderRadius: "12px", color: "#10b981" }}>
                <RotateCcw size={32} />
              </div>
            </div>
            <h1 style={{ margin: 0, fontSize: "48px", fontWeight: "700", color: "#fff" }}>
              {data.totalReturned}
            </h1>
          </motion.div>
        </motion.div>
      )}

      {/* 🔷 MEMBER ONLY: CLEAN WELCOME EXPERIENCE */}
      {!isAdmin() && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", 
            gap: "30px", 
            marginTop: "30px" 
          }}
        >
          <div 
            className="card" 
            onClick={() => navigate("/books")}
            style={{ padding: "40px", display: "flex", alignItems: "center", gap: "25px", cursor: "pointer" }}
          >
            <div style={{ padding: "20px", background: "rgba(56, 189, 248, 0.1)", borderRadius: "20px", color: "#38bdf8" }}>
              <BookMarked size={40} />
            </div>
            <div>
              <h3 style={{ margin: "0 0 10px 0", color: "#fff" }}>Browse Collections</h3>
              <p style={{ margin: 0, color: "#94a3b8" }}>Explore through our categories to find your next great book.</p>
            </div>
          </div>

          <div 
            className="card" 
            onClick={() => navigate("/my-books")}
            style={{ padding: "40px", display: "flex", alignItems: "center", gap: "25px", cursor: "pointer" }}
          >
            <div style={{ padding: "20px", background: "rgba(99, 102, 241, 0.1)", borderRadius: "20px", color: "#818cf8" }}>
              <Sparkles size={40} />
            </div>
            <div>
              <h3 style={{ margin: "0 0 10px 0", color: "#fff" }}>Manage Requests</h3>
              <p style={{ margin: 0, color: "#94a3b8" }}>Keep track of your current issues and pending returns easily.</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}