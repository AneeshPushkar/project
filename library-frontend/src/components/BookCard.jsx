import * as motion from "framer-motion";

const BookCard = ({ book }) => {
  return (
    <motion.div 
      className="glass"
      whileHover={{ scale: 1.05 }}
    >
      <h3>{book.title}</h3>
      <p>{book.author}</p>

      <div style={{ marginTop: "10px" }}>
        <span>📦 Total: {book.totalCopies}</span><br/>
        <span>✅ Available: {book.availableCopies}</span>
      </div>
    </motion.div>
  );
};

export default BookCard;