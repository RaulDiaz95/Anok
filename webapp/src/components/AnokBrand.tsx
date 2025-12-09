import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export function AnokBrand() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="inline-flex"
    >
      <Link
        to="/"
        className="inline-flex items-center text-2xl font-bold text-[#b11226] hover:text-[#d31a33] transition brand-pulse"
      >
        ANOK<span className="text-white">EVENTS</span>
      </Link>
    </motion.div>
  );
}
