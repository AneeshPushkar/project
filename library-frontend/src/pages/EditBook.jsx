import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    totalCopies: 1,
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Load Book Details
    API.get(`/api/books/${id}`)
      .then(res => setData(res.data.data))
      .catch(() => toast.error("Error loading book"));

    // Load Existing Categories
    API.get("/api/books/categories")
      .then((res) => {
        const validCategories = res.data.data.filter(c => c && c.trim() !== "");
        setCategories(validCategories);
      })
      .catch(() => {});
  }, [id]);

  const updateBook = async () => {
    try {
      await API.put(`/api/books/${id}`, data);
      toast.success("Updated successfully ✏️");
      navigate("/books");
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="form-card">
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>✏️ Edit Book</h2>

      <div className="form-group">
        <label>Book Title</label>
        <input
          value={data.title}
          onChange={(e) => setData({ ...data, title: e.target.value })}
          placeholder="Title"
        />
      </div>

      <div className="form-group">
        <label>Author</label>
        <input
          value={data.author}
          onChange={(e) => setData({ ...data, author: e.target.value })}
          placeholder="Author"
        />
      </div>

      <div className="form-group">
        <label>ISBN Identifier</label>
        <input
          value={data.isbn}
          onChange={(e) => setData({ ...data, isbn: e.target.value })}
          placeholder="ISBN"
        />
      </div>

      <div className="form-group">
        <label>Category / Genre</label>
        <input 
          list="edit-categories"
          placeholder="Type or select genre..." 
          value={data.category || ""}
          onChange={(e) => setData({ ...data, category: e.target.value })}
        />
        <datalist id="edit-categories">
          {categories.map((cat, idx) => (
            <option key={idx} value={cat} />
          ))}
        </datalist>
      </div>

      <div className="form-group">
        <label>Total Copies</label>
        <input
          type="number"
          min="1"
          value={data.totalCopies}
          onChange={(e) => setData({ ...data, totalCopies: e.target.value })}
        />
      </div>

      <button className="btn" onClick={updateBook} style={{ marginTop: '10px' }}>Save Changes</button>
    </motion.div>
  );
}