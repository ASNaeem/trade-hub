import React from "react";
import { ShieldCheck } from "lucide-react";

const VerificationBadge = ({ isVerified, className }) => {
  if (!isVerified) return null;

  return (
    <div
      className={`inline-flex items-center text-green-600 ${className}`}
      title="Verified User"
    >
      <ShieldCheck className="w-4 h-4 mr-1" />
      <span className="text-sm">Verified</span>
    </div>
  );
};

export default VerificationBadge;
