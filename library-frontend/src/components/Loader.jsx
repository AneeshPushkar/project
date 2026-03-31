import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1 }}
        style={{
          width: "40px",
          height: "40px",
          border: "4px solid #38bdf8",
          borderTop: "4px solid transparent",
          borderRadius: "50%",
          margin: "auto"
        }}
      />
      <p>Loading...</p>
    </div>
  );
}