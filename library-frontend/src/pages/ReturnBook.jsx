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
      await API.post("/api/issues/return", {
        issueId: Number(form.issueId),
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