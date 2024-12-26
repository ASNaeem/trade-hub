import React from "react";

const FormField = ({ label, required = false, children }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--primaryColor)] mb-2">
        {label} {required && "*"}
      </label>
      {children}
    </div>
  );
};

export default FormField;
