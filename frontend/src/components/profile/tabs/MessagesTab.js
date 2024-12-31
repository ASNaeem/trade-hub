import React, { useEffect, useState } from "react";
import { Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useMessages from "../../../hooks/useMessages";

const MessagesTab = ({ inbox }) => {
  const navigate = useNavigate();
  const { messages, loading, error } = useMessages();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-gray-500">Loading messages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!inbox || inbox.length === 0) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-gray-500">No messages yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {inbox.map((data) => (
        <div
          key={data.id}
          className={`p-4 rounded-lg hover:bg-gray-50 cursor-pointer`}
          onClick={() => navigate(`/inbox?userId=${data.id}`)}
        >
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                <img
                  src={
                    data.profilePicture === "null"
                      ? "https://files.catbox.moe/aq0wd6.jpg"
                      : data.profilePicture
                  }
                  alt="User avatar"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">{data.name}</p>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500">
                    {new Date(data.lastMessage.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-500 truncate">
                {data.lastMessage.content}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessagesTab;
