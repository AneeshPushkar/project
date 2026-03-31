import { useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

export default function ReturnBook() {
  const [form, setForm] = useState({
    issueId: "",
    finePaid: false
  });

  const submit = async () => {
    try {
      if (!form.issueId.trim()) {
        toast.error("Issue ID is required");
        return;
      }

      await API.post("/api/issues/return", {
        // MongoDB ObjectId must be a string.
        issueId: form.issueId.trim(),
        finePaid: form.finePaid
      });

      toast.success("Book Returned ✅");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Return failed");
    }
  };

  return (
    <div className="glass">
      <h2>Return Book</h2>

      <input
        placeholder="Issue ID"
        onChange={(e) => setForm({ ...form, issueId: e.target.value })}
      />

      <label>
        <input
          type="checkbox"
          onChange={(e) => setForm({ ...form, finePaid: e.target.checked })}
        />
        Fine Paid
      </label>

      <button onClick={submit}>Return Book</button>
    </div>
  );
}