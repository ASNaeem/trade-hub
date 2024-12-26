import React from "react";
import { Circle } from "lucide-react";

//#region Fake data
const messages = [
  {
    id: 1,
    sender: "John Doe",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    preview: "Hi, is the vintage camera still available?",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: 2,
    sender: "Alice Smith",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    preview: "Thanks for the quick response! When can we meet?",
    time: "1 day ago",
    unread: false,
  },
];
//#endregion

const MessagesTab = () => {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`p-4 rounded-lg ${
            message.unread ? "bg-blue-50" : "bg-white"
          } hover:bg-gray-50 cursor-pointer`}
          onClick={() => {
            window.location.href = `/inbox?message=${message.id}`;
          }}
        >
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <img
                src={message.avatar}
                alt={message.sender}
                className="h-12 w-12 object-cover rounded-full"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">
                  {message.sender}
                </p>
                <div className="flex items-center">
                  {message.unread && (
                    <Circle className="h-2 w-2 fill-current mr-2" />
                  )}
                  <span className="text-sm text-gray-500">{message.time}</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 truncate">
                {message.preview}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessagesTab;
