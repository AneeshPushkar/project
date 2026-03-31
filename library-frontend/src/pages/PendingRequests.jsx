import { useEffect, useState } from "react";
import API from "../services/api";
import { motion } from "framer-motion";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

export default function PendingRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await API.get("/api/issues/pending");
      setRequests(res.data.data || []);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const approveRequest = async (id) => {
    try {
      await API.post(`/api/issues/approve/${id}`);
      toast.success("Request approved ✅");
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to approve");
    }
  };

  const rejectRequest = async (id) => {
    try {
      await API.post(`/api/issues/reject/${id}`);
      toast.success("Request rejected ❌");
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject");
    }
  };

  if (loading) return <Loader />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="hero-section" style={{ textAlign: "left", padding: "40px 60px" }}>
        <h1 style={{ margin: 0 }}>🔔 Library Notifications</h1>
        <p>Review and decide on pending issue and return requests from members.</p>
      </div>

      {requests.length === 0 ? (
        <div className="glass" style={{ padding: '60px', textAlign: 'center', marginTop: '20px' }}>
          <p style={{ color: '#94a3b8' }}>All caught up! No active requests to process.</p>
        </div>
      ) : (
        <div className="table-container glass" style={{ marginTop: '20px', padding: '10px' }}>
          <table style={{ width: "100%", borderCollapse: 'separate', borderSpacing: '0 8px' }}>
            <thead>
              <tr style={{ color: '#94a3b8' }}>
                <th>REQ ID</th>
                <th>Request Type</th>
                <th>Requested By</th>
                <th>Book Information</th>
                <th>Management Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id}>
                  <td style={{ paddingLeft: '15px' }}>#{req.id}</td>
                  <td>
                    <span 
                      style={{ 
                        background: req.status === "P_ISSUE" ? 'rgba(56, 189, 248, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        color: req.status === "P_ISSUE" ? '#38bdf8' : '#f59e0b',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '700'
                      }}
                    >
                      {req.status === "P_ISSUE" ? "Issue Requested" : "Return Requested"}
                    </span>
                  </td>
                  <td>
                    <strong>{req.userName || "Unknown"}</strong> <br/> 
                    <small style={{ color: '#64748b' }}>User #{req.userId}</small>
                  </td>
                  <td>
                    <strong>{req.bookTitle || "Unknown"}</strong> <br/> 
                    <small style={{ color: '#64748b' }}>Book ID: {req.bookId}</small>
                  </td>
                  <td style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => approveRequest(req.id)} className="btn" style={{ width: 'auto', background: '#28a745', padding: '10px 20px' }}>
                      Approve
                    </button>
                    <button onClick={() => rejectRequest(req.id)} className="delete-btn" style={{ width: 'auto', padding: '10px 20px' }}>
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
