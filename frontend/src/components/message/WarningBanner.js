import React from "react";
import { AlertTriangle } from "lucide-react";

export function WarningBanner() {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4">
      <div className="flex items-center">
        <AlertTriangle className="text-amber-500 mr-3" size={24} />
        <div>
          <h3 className="font-medium text-amber-800">Security Warning</h3>
          <p className="text-amber-700 text-sm">
            Please do not share sensitive information such as passwords, credit
            card details, or personal identification numbers in this chat.
          </p>
        </div>
      </div>
    </div>
  );
}
