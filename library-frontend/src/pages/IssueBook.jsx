import { useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

export default function IssueBook() {
  const [f, setF] = useState({
    userId: "",
    bookId: "",
    dueDate: ""
  });

  const submit = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        toast.error("User not logged in");
        return;
      }

      if (!f.userId || !f.bookId || !f.dueDate) {
        toast.error("All fields are required");
        return;
      }

      await API.post("/api/issues/issue", {
        userId: Number(f.userId),  // ✅ Use specified user ID
        bookId: Number(f.bookId),  // ✅ number
        dueDate: f.dueDate         // ✅ correct format
      });

      toast.success("Book Issued ✅");

      // 🔄 Reset form
      setF({ userId: "", bookId: "", dueDate: "" });

    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Validation Failed");
    }
  };

  return (
    <div className="glass">
      <h2>Issue Book</h2>

      <input
        placeholder="User ID"
        value={f.userId}
        onChange={(e) =>
          setF({ ...f, userId: e.target.value })
        }
      />

      <input
        placeholder="Book ID"
        value={f.bookId}
        onChange={(e) =>
          setF({ ...f, bookId: e.target.value })
        }
      />

      <input
        type="date"
        value={f.dueDate}
        onChange={(e) =>
          setF({ ...f, dueDate: e.target.value })
        }
      />

      <button onClick={submit}>
        Issue
      </button>
    </div>
  );
}