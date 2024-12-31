import React from "react";
import { User, Circle } from "lucide-react";

export function ChatHeader({
  name,
  profilePicture = "null",
  status = "online",
  lastSeen,
}) {
  return (
    <div className="p-4 border-b flex items-center gap-3">
      <div className="w-10 h-10 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center">
        {profilePicture == "null" ? (
          <img src="https://files.catbox.moe/aq0wd6.jpg" alt="User avatar" />
        ) : (
          <img
            src={profilePicture}
            alt="User avatar"
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div className="flex-1">
        <h1 className="text-lg font-semibold text-gray-800">{name}</h1>
      </div>
    </div>
  );
}
