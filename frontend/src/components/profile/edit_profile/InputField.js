import React from "react";
import { Input } from "@nextui-org/react";

export default function InputField({
  placeholder,
  label,
  name,
  value,
  onChange,
  type = "text",
}) {
  return (
    <div>
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
    </div>
  );
}
