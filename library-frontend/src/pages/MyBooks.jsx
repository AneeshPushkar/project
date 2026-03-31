import { useEffect, useState } from "react";
import API from "../services/api";
import { motion } from "framer-motion";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

export default function MyBooks() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyIssues = async () => {
    setLoading(true);
    try {
      const userTxt = localStorage.getItem("user");
      if (!userTxt) return;
      const user = JSON.parse(userTxt);

      const res = await API.get(`/api/issues/user/${user.id}`);
      setIssues(res.data.data || []);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load your books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyIssues();
  }, []);

  const requestReturn = async (issueId) => {
    try {
      await API.post(`/api/issues/return-request`, {
        issueId: issueId,
        finePaid: false
      });
      toast.success("Return request sent ✅");
      fetchMyIssues(); // refresh list
    } catch (err) {
      toast.error(err.response?.data?.message || "Return request failed");
    }
  };

  // 📝 Status Readability Mapper
  const formatStatus = (status) => {
    switch (status) {
      case "P_ISSUE": return "Issue Requested ⏳";
      case "P_RETURN": return "Return Requested ⏳";
      case "ISSUED": return "Currently Borrowed 📖";
      case "RETURNED": return "Returned 📦";
      case "REJECTED": return "Rejected ❌";
      default: return status || "ISSUED";
    }
  };

  if (loading) return <Loader />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="hero-section" style={{ padding: '40px' }}>
         <h1 style={{ margin: 0 }}>📖 My Borrowed Books</h1>
         <p>Manage your active rentals and track pending requests below.</p>
      </div>

      {issues.length === 0 ? (
        <div className="glass" style={{ padding: '60px', textAlign: 'center', marginTop: '20px' }}>
           <p style={{ fontSize: '18px', color: '#94a3b8' }}>You have no active books or pending requests at the moment.</p>
        </div>
      ) : (
        <div className="grid">
          {issues.map((issue) => (
            <motion.div 
              key={issue.id} 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="book-info">
                <div 
                   className="badge category" 
                   style={{ 
                     position: 'relative', 
                     left: 0, top: 0, 
                     marginBottom: '10px', 
                     background: 'rgba(56, 189, 248, 0.1)',
                     color: '#38bdf8' 
                   }}
                >
                  {formatStatus(issue.status)}
                </div>

                <h3>{issue.bookTitle || "Unknown Book"}</h3>
                <p className="author" style={{ fontSize: '12px' }}>Request ID: #{issue.id}</p>
                
                <div style={{ marginTop: '15px', color: '#94a3b8', fontSize: '14px' }}>
                   📅 <strong>Due On:</strong> {issue.dueDate || "Not set"}
                </div>

                <div className="actions" style={{ marginTop: '25px' }}>
                  {(issue.status === "ISSUED" || !issue.status) && (
                    <button className="btn" onClick={() => requestReturn(issue.id)}>
                      🔄 Complete Reading & Return
                    </button>
                  )}
                  {issue.status === "P_RETURN" && (
                    <button className="btn-secondary" disabled style={{ opacity: 0.8, cursor: 'not-allowed' }}>
                      ⏳ Return Pending Approval
                    </button>
                  )}
                  {issue.status === "P_ISSUE" && (
                    <button className="btn-secondary" disabled style={{ opacity: 0.8, cursor: 'not-allowed' }}>
                      ⏳ Awaiting Library Approval
                    </button>
                  )}
                </div>
              </div>
              
              {/* ✅ Book Image with Fallback */}
              <div className="book-cover" style={{ marginTop: '20px' }}>
                <img 
                  src={`https://covers.openlibrary.org/b/isbn/${issue.bookIsbn}-M.jpg`} 
                  onError={(e) => e.target.src = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop"} 
                  alt="Book Cover" 
                />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
