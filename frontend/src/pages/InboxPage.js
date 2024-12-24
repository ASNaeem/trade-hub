import React, { useState } from "react";
import { WarningBanner } from "../components/message/WarningBanner";
import { MessageInput } from "../components/message/MessageInput";
import { Message } from "../components/message/Message";
import { ChatHeader } from "../components/message/ChatHeader";
import Header from "../components/Header";

export default function InboxPage() {
  // Set initial state for messages, starting with a welcome message
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Welcome! How can I help you today?",
      timestamp: new Date(Date.now() - 3600000),
      isOwn: false,
      senderName: "Sarah Johnson",
    },
  ]);

  // Handle sending a message and updating the state
  const handleSendMessage = async (text, images) => {
    const imageUrls = images?.map((image) => URL.createObjectURL(image));

    const newMessage = {
      id: Date.now().toString(), // Unique message ID based on current timestamp
      text,
      timestamp: new Date(),
      imageUrls,
      isOwn: true, // Assuming the sent message is from the current user
      senderName: "You", // Set sender name to "You" for sent messages
    };

    // Update state with the new message
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Optionally simulate receiving a response after a delay
    setTimeout(() => {
      const responseMessage = {
        id: Date.now().toString(),
        text: "I am here to assist you! How can I help further?",
        timestamp: new Date(),
        isOwn: false, // Received message from the assistant
        senderName: "Sarah Johnson",
      };

      // Add the response message to the state
      setMessages((prevMessages) => [...prevMessages, responseMessage]);
    }, 2000); // Simulate a response after 2 seconds
  };

  return (
    <div className="min-h-screen bg-texture">
      <Header
        shadow={true}
        className="text-black bg-[#FFF] overflow-hidden fill-[#49647D]"
      />
      <div className="max-w-4xl mx-auto p-4 pt-20">
        <WarningBanner />

        <div className="bg-white rounded-lg shadow-lg">
          <ChatHeader
            name="Sarah Johnson"
            status="online"
            lastSeen={new Date(Date.now() - 300000)}
          />

          <div className="h-[600px] overflow-x-hidden overflow-y-auto p-4">
            {/* Map over messages and display them */}
            {messages.map((message) => (
              <Message
                key={message.id}
                text={message.text}
                timestamp={message.timestamp}
                imageUrls={message.imageUrls}
                isOwn={message.isOwn}
                senderName={message.senderName}
              />
            ))}
          </div>

          {/* Message input component to send new messages */}
          <MessageInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}
