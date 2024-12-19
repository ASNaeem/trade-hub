import React from "react";

const FormField = ({ label, required = false, children }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-[#173A5B] mb-2">
        {label} {required && "*"}
      </label>
      {children}
    </div>
  );
};

export default FormField;
