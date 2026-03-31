import { useEffect, useState } from "react";
import API from "../services/api";
import { motion } from "framer-motion";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { isAdmin, isMember } from "../utils/auth";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch unique categories on mount
  useEffect(() => {
    API.get("/api/books/categories")
      .then((res) => {
        // filter out nulls/empties just in case
        const validCategories = res.data.data.filter(c => c && c.trim() !== "");
        setCategories(validCategories);
      })
      .catch(() => console.error("Failed to load categories"));
  }, []);

  // Fetch books based on selected category & page
  const fetchBooks = () => {
    setLoading(true);

    const url = selectedCategory === "All" 
      ? `/api/books?page=${page}&size=8`
      : `/api/books/category/${encodeURIComponent(selectedCategory)}?page=${page}&size=8`;

    API.get(url)
      .then((res) => setBooks(res.data.data.content || []))
      .catch(() => setBooks([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, selectedCategory]);

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    setPage(0); // reset pagination when switching category
  };

  // Image Fallback
  const handleImageError = (e) => {
    e.target.src = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop";
  };

  // 🗑 DELETE (ADMIN)
  const deleteBook = async (id) => {
    if (!window.confirm("Are you sure you want to delete this specific book?")) return;

    try {
      await API.delete(`/api/books/${id}`);
      toast.success("Book deleted 🗑️");
      fetchBooks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed ❌");
    }
  };

  // 👤 MEMBER REQUEST
  const requestBook = async (bookId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await API.post("/api/issues/request", {
        userId: user.id,
        bookId: bookId,
        dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
      });
      toast.success("Request sent 📩");
    } catch (err) {
      toast.error(err.response?.data?.message || "Request failed");
    }
  };

  const filtered = books.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      
      {/* 🔷 PREMIUM HERO SECTION */}
      <div className="hero-section">
        <div className="hero-glow"></div>
        <h1>Explore Our Library</h1>
        <p>Discover thousands of premium books carefully collected for our members. Select a category below to instantly dive into a new world.</p>
        
        <div className="search-container">
          <input
            className="search-input"
            placeholder="🔍 Search for titles, authors, or genres..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* 🔷 CATEGORY PILL BAR */}
      <div className="pill-container">
        <div 
          className={`pill ${selectedCategory === "All" ? "active" : ""}`}
          onClick={() => handleCategoryClick("All")}
        >
          🌐 All Books
        </div>
        
        {categories.map((cat, idx) => (
          <div 
            key={idx} 
            className={`pill ${selectedCategory === cat ? "active" : ""}`}
            onClick={() => handleCategoryClick(cat)}
          >
            {cat}
          </div>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          {/* 🔷 GRID OF BOOKS */}
          {filtered.length === 0 ? (
            <p style={{textAlign: 'center', color: '#64748b'}}>No books found for this category or search.</p>
          ) : (
            <div className="grid">
              {filtered.map((b) => (
                <motion.div key={b.id} className="card">
                  
                  {/* Category Badge */}
                  {b.category && (
                    <div className="badge category">{b.category}</div>
                  )}

                  {/* Availability Badge */}
                  <div className="badge" style={{
                    background: b.availableCopies > 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(225, 29, 72, 0.2)',
                    color: b.availableCopies > 0 ? '#10b981' : '#fb7185',
                    borderColor: b.availableCopies > 0 ? 'rgba(16, 185, 129, 0.4)' : 'rgba(225, 29, 72, 0.4)'
                  }}>
                    {b.availableCopies > 0 ? 'Available' : 'Out of Stock'}
                  </div>
                  
                  {/* Book Cover */}
                  <div className="book-cover">
                    <img 
                      src={`https://covers.openlibrary.org/b/isbn/${b.isbn}-M.jpg`} 
                      onError={handleImageError} 
                      alt="Book Cover" 
                    />
                  </div>

                  <div className="book-info">
                    <h3>{b.title}</h3>
                    <p className="author">By {b.author}</p>
                    
                    <div className="book-stats">
                      <span>Total: <strong>{b.totalCopies}</strong></span>
                      <span>Left: <strong>{b.availableCopies}</strong></span>
                    </div>

                    <div className="actions">
                      {/* 👑 ADMIN */}
                      {isAdmin() && (
                        <>
                          <button className="btn-secondary" onClick={() => navigate(`/edit-book/${b.id}`)}>
                            ✏️ Edit
                          </button>
                          <button className="delete-btn" onClick={() => deleteBook(b.id)}>
                            🗑
                          </button>
                        </>
                      )}

                      {/* 👤 MEMBER */}
                      {isMember() && (
                        <button 
                          className="btn" 
                          onClick={() => requestBook(b.id)}
                          disabled={b.availableCopies === 0}
                          style={{opacity: b.availableCopies === 0 ? 0.5 : 1}}
                        >
                          📩 Request
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* 🔷 PAGINATION */}
          <div className="pagination" style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '40px' }}>
            <button 
              className="btn-secondary" 
              style={{ width: 'auto'}} 
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              disabled={page === 0}
            >
              ⬅ Prev Page
            </button>
            
            {/* If we loaded exactly 8 books, there might be a next page. */}
            <button 
              className="btn-secondary" 
              style={{ width: 'auto'}} 
              onClick={() => setPage((p) => p + 1)}
              disabled={filtered.length < 8}
            >
              Next Page ➡
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
}