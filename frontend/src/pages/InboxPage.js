import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { WarningBanner } from "../components/message/WarningBanner";
import { MessageInput } from "../components/message/MessageInput";
import { Message } from "../components/message/Message";
import { ChatHeader } from "../components/message/ChatHeader";
import Header from "../components/Header";
import useMessages from "../hooks/useMessages";

export default function InboxPage() {
  const location = useLocation();
  const receiverId = new URLSearchParams(location.search).get("userId");
  const { messages, loading, error, sendMessage, markAsRead } = useMessages();

  // Mark messages as read when they are viewed
  // useEffect(() => {
  //   const unreadMessages = messages.filter(
  //     (msg) => !msg.isRead && msg.receiverId === receiverId
  //   );
  //   unreadMessages.forEach((msg) => markAsRead(msg._id));
  // }, []);

  const handleSendMessage = async (text, images) => {
    if (!receiverId) {
      console.error("No receiver ID provided");
      return;
    }

    try {
      // For now, we'll just send the text content
      // TODO: Implement image upload functionality
      await sendMessage(receiverId, text);
      console.log(messages);
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
            name={receiverId ? "Chat" : "Select a conversation"}
            status={receiverId ? "online" : "offline"}
          />

          {renderContent()}

          {receiverId && <MessageInput onSendMessage={handleSendMessage} />}
        </div>
      </div>
    </div>
  );
}
