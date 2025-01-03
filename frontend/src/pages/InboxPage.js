import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { WarningBanner } from "../components/message/WarningBanner";
import { MessageInput } from "../components/message/MessageInput";
import { Message } from "../components/message/Message";
import { ChatHeader } from "../components/message/ChatHeader";
import Header from "../components/Header";
import useMessages from "../hooks/useMessages";
import axios from "axios";

export default function InboxPage() {
  const location = useLocation();
  const receiverId = new URLSearchParams(location.search).get("userId");
  const [current_user, setcurrent_user] = useState("");
  const { messages, loading, error, sendMessage, markAsRead } = useMessages();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/users/${receiverId}`).then((res) => {
      if (res.data) {
        console.log(res.data.name);
        setcurrent_user(res.data);
      }
    });
  }, [messages]);

  const handleSendMessage = async (text, images = []) => {
    if (!receiverId) {
      console.error("No receiver ID provided");
      return;
    }

    try {
      await sendMessage(receiverId, text, images);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-[600px]">
          <p className="text-gray-500">Loading messages...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-[600px]">
          <p className="text-red-500">Error: {error}</p>
        </div>
      );
    }

    if (!receiverId) {
      return (
        <div className="flex items-center justify-center h-[600px]">
          <p className="text-gray-500">
            Select a conversation to start messaging
          </p>
        </div>
      );
    }

    return (
      <div className="h-[600px] overflow-x-hidden overflow-y-auto p-4">
        {messages
          .filter(
            (msg) =>
              msg.senderId === receiverId || msg.receiverId === receiverId
          )
          .reverse()
          .map((message) => (
            <Message
              key={message._id}
              text={message.content}
              images={message.images}
              timestamp={new Date(message.createdAt)}
              isOwn={message.senderId !== receiverId}
              senderName={message.senderId === receiverId ? "Them" : "You"}
            />
          ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fefefe]">
      <Header
        shadow={true}
        className="text-black bg-[var(--foreGroundColor)] overflow-hidden fill-[var(--buttonColor)]"
      />
      <div className="max-w-4xl mx-auto p-4 pt-20">
        <WarningBanner />

        <div className="bg-white rounded-lg shadow-lg">
          <ChatHeader
            name={current_user.name ? current_user.name : "User"}
            profilePicture={current_user.profilePicture}
            status={receiverId ? "online" : "offline"}
          />

          {renderContent()}

          {receiverId && <MessageInput onSendMessage={handleSendMessage} />}
        </div>
      </div>
    </div>
  );
}
