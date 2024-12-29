import React from "react";
import { User, Circle } from "lucide-react";

export function ChatHeader({ name, status = "online", lastSeen }) {
  return (
    <div className="p-4 border-b flex items-center gap-3">
      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
        <User className="text-gray-600" size={20} />
      </div>
      <div className="flex-1">
        <h1 className="text-lg font-semibold text-gray-800">{name}</h1>
        <div className="flex items-center gap-2">
          <Circle
            size={8}
            fill={status === "online" ? "#10B981" : "#6B7280"}
            className={
              status === "online" ? "text-emerald-500" : "text-gray-500"
            }
          />
          <span className="text-sm text-gray-500">
            {status === "online"
              ? "Online"
              : //: lastSeen
                //? `Last seen ${formatLastSeen(lastSeen)}`
                "Offline"}
          </span>
        </div>
      </div>
    </div>
  );
}
