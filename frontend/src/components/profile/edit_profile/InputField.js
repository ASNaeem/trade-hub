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
  disabled = false,
  className = "",
}) {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <label
        htmlFor={name}
        className={`block text-sm pb-2 font-medium text-[var(--primaryColor)] ${
          disabled ? "opacity-60" : ""
        }`}
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
        disabled={disabled}
        className={`${className} ${
          disabled ? "opacity-60 cursor-not-allowed" : ""
        }`}
        isReadOnly={disabled}
      />
    </motion.div>
  );
}
