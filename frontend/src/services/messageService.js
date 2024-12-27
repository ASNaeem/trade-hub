import api from "./api";

const MessageService = {
  // Get all messages for the current user
  getUserMessages: async () => {
    try {
      const response = await api.get("/messages");
      return response.data;
    } catch (error) {
      console.error("Error in getUserMessages:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch messages"
      );
    }
  },

  // Send a new message
  sendMessage: async (receiverId, content) => {
    try {
      const response = await api.post("/messages", { receiverId, content });
      return response.data;
    } catch (error) {
      console.error("Error in sendMessage:", error);
      throw new Error(
        error.response?.data?.message || "Failed to send message"
      );
    }
  },

  // Mark a message as read
  markMessageAsRead: async (messageId) => {
    try {
      const response = await api.put(`/messages/${messageId}/read`);
      return response.data;
    } catch (error) {
      console.error("Error in markMessageAsRead:", error);
      throw new Error(
        error.response?.data?.message || "Failed to mark message as read"
      );
    }
  },
};

export default MessageService;
