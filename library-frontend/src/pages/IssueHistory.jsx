import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import { isAdmin } from "../utils/auth";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function IssueHistory() {
  const [history, setHistory] = useState([]);

  if (!isAdmin()) return <Navigate to="/" />;

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await API.get("/api/issues/all");
      setHistory(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load issue history");
    }
  };

  // 🌈 Color and Status Mapping
  const statusConfig = (status) => {
    switch (status) {
      case "ISSUED": return { color: "#38bdf8", text: "Currently Borrowed" };
      case "RETURNED": return { color: "#10b981", text: "Returned Safely" };
      case "P_ISSUE": return { color: "#f59e0b", text: "Issue Requested" };
      case "P_RETURN": return { color: "#fd7e14", text: "Return Requested" };
      case "REJECTED": return { color: "#fb7185", text: "Rejected" };
      case "OVERDUE": return { color: "#818cf8", text: "Overdue" };
      default: return { color: "#94a3b8", text: status || "Unknown" };
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="hero-section" style={{ textAlign: "left", padding: "40px 60px" }}>
        <h1 style={{ margin: 0 }}>📜 Master Library Archives</h1>
        <p>Complete historical audit trail of all book issues, returns, and requests.</p>
      </div>

      <div className="table-container glass" style={{ marginTop: '20px', padding: '10px' }}>
        {history.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <p style={{ color: '#94a3b8' }}>Archive is currently empty.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px', textAlign: 'left' }}>
            <thead>
              <tr style={{ color: '#94a3b8' }}>
                <th style={{ padding: '10px 15px' }}>ID</th>
                <th>Member Information</th>
                <th>Book Information</th>
                <th>Dates</th>
                <th>Audit Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((record) => {
                const config = statusConfig(record.status);
                return (
                  <tr key={record.id}>
                    <td style={{ padding: '15px' }}>#{record.id}</td>
                    <td>
                      <strong>{record.userName || "Unknown"}</strong><br/>
                      <small style={{color: '#64748b'}}>(ID: {record.userId})</small>
                    </td>
                    <td>
                      <strong>{record.bookTitle || "Unknown"}</strong><br/>
                      <small style={{color: '#64748b'}}>(ID: {record.bookId})</small>
                    </td>
                    <td>
                      <div style={{ fontSize: '13px' }}>
                        📅 Issued: {record.issueDate || "--"}<br/>
                        ⏰ Due: {record.dueDate || "--"}
                      </div>
                    </td>
                    <td>
                      <span style={{
                        backgroundColor: `${config.color}20`,
                        color: config.color,
                        padding: '6px 12px',
                        border: `1px solid ${config.color}40`,
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '700'
                      }}>
                        {config.text}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
}
