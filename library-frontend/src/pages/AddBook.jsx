import { useState, useEffect } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function AddBook() {
  const [form, setForm] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    totalCopies: 1,
  });
  
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Optionally fetch existing categories to list in datalist
    API.get("/api/books/categories")
      .then((res) => {
        const validCategories = res.data.data.filter(c => c && c.trim() !== "");
        setCategories(validCategories);
      })
      .catch(() => console.log("No categories found to prepopulate"));
  }, []);

  const submit = async () => {
    if(!form.title || !form.author || !form.isbn || !form.category) {
      toast.error("Please fill out Name, Author, ISBN, and Category!");
      return;
    }

    try {
      await API.post("/api/books", form);
      toast.success("Book Officially Added! 📚");
      navigate("/books");
    } catch {
      toast.error("Failed to add book. ISBN might be duplicate?");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="form-card">
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>⊕ Add New Book</h2>
      
      <div className="form-group">
        <label>Book Title</label>
        <input 
          placeholder="e.g. The Great Gatsby" 
          value={form.title}
          onChange={(e)=>setForm({...form,title:e.target.value})}
        />
      </div>

      <div className="form-group">
        <label>Author Name</label>
        <input 
          placeholder="e.g. F. Scott Fitzgerald" 
          value={form.author}
          onChange={(e)=>setForm({...form,author:e.target.value})}
        />
      </div>

      <div className="form-group">
        <label>ISBN Number</label>
        <input 
          placeholder="e.g. 978-3-16-148410-0" 
          value={form.isbn}
          onChange={(e)=>setForm({...form,isbn:e.target.value})}
        />
      </div>

      <div className="form-group">
        <label>Category / Genre</label>
        <input 
          list="preset-categories"
          placeholder="Type explicitly or select from list..." 
          value={form.category}
          onChange={(e)=>setForm({...form,category:e.target.value})}
        />
        <datalist id="preset-categories">
          {categories.map((cat, idx) => (
            <option key={idx} value={cat} />
          ))}
        </datalist>
      </div>

      <div className="form-group">
        <label>Number of Copies Available</label>
        <input 
          type="number"
          min="1"
          value={form.totalCopies}
          onChange={(e)=>setForm({...form,totalCopies: e.target.value})}
        />
      </div>

      <button className="btn" onClick={submit} style={{ marginTop: '10px' }}>Publish to Library</button>
    </motion.div>
  );
}