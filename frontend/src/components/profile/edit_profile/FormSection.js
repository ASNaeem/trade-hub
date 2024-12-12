import React from "react";

export default function FormSection({ title, children }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">{title}</h2>
      {children}
    </div>
  );
}
