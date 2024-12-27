import React from "react";
import { Input } from "@nextui-org/react";
import { motion } from "framer-motion";

export default function InputField({
  placeholder,
  label,
  name,
  value,
  onChange,
  type = "text",
}) {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <label
        htmlFor={name}
        className="block text-sm pb-2 font-medium text-[var(--primaryColor)] "
      >
        {label}
      </label>
      <Input
        placeholder={placeholder}
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        radius="sm"
      />
    </motion.div>
  );
}
