import React from "react";
import { motion } from "framer-motion";
const FormField = ({ label, required = false, children }) => {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <label className="block text-sm font-medium text-[var(--primaryColor)] mb-2">
        {label} {required && "*"}
      </label>
      {children}
    </motion.div>
  );
};

export default FormField;
