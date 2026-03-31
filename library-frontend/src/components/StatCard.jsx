import { motion } from "framer-motion";

const StatCard = ({ title, value }) => {
  return (
    <motion.div
      className="glass"
      whileHover={{ scale: 1.05 }}
    >
      <h4>{title}</h4>
      <h1>{value}</h1>
    </motion.div>
  );
};

export default StatCard;