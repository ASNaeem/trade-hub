import { useState, useEffect, useCallback } from "react";
import MessageService from "../services/messageService";

const useMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all messages
  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await MessageService.getUserMessages();
      setMessages(data);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Send a new message
  const sendMessage = async (receiverId, content) => {
    try {
      setError(null);
      const newMessage = await MessageService.sendMessage(receiverId, content);
      setMessages((prev) => [...prev, newMessage]);
      return newMessage;
    } catch (err) {
      console.error("Error sending message:", err);
      setError(err.message);
      throw err;
    }
  };

  // Mark a message as read
  const markAsRead = async (messageId) => {
    try {
      setError(null);
      const updatedMessage = await MessageService.markMessageAsRead(messageId);
      setMessages((prev) =>
        prev.map((msg) => (msg._id === messageId ? updatedMessage : msg))
      );
    } catch (err) {
      console.error("Error marking message as read:", err);
      setError(err.message);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return {
    messages,
    loading,
    error,
    sendMessage,
    markAsRead,
    refreshMessages: fetchMessages,
  };
};

export default useMessages;
