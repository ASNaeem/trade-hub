const MessageClass = require("../classes/Message");
const MessageModel = require("../models/messageSchema");
const UserModel = require("../models/userSchema");

const MessageService = {
  async createMessage(senderId, receiverId, content) {
    // Verify both users exist
    const [sender, receiver] = await Promise.all([
      UserModel.findById(senderId),
      UserModel.findById(receiverId),
    ]);

    if (!sender || !receiver) {
      throw new Error("Sender or receiver not found");
    }

    const messageClassInstance = new MessageClass(
      null,
      senderId,
      receiverId,
      content
    );

    const messageDocument = new MessageModel({
      senderId: messageClassInstance.senderId,
      receiverId: messageClassInstance.receiverId,
      content: messageClassInstance.content,
      isRead: messageClassInstance.isRead,
      createdAt: messageClassInstance.createdAt,
    });

    const savedMessage = await messageDocument.save();

    // Create new instance with saved data and return summary
    const savedInstance = new MessageClass(
      savedMessage._id,
      savedMessage.senderId,
      savedMessage.receiverId,
      savedMessage.content,
      savedMessage.createdAt
    );
    return savedInstance.getSummary();
  },

  async getUserMessages(userId) {
    const messages = await MessageModel.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    })
      .sort({ createdAt: -1 })
      .populate("senderId", "name email")
      .populate("receiverId", "name email");

    return messages.map((msg) =>
      new MessageClass(
        msg._id,
        msg.senderId,
        msg.receiverId,
        msg.content,
        msg.createdAt
      ).getSummary()
    );
  },

  async markMessageAsRead(messageId, userId) {
    const message = await MessageModel.findOneAndUpdate(
      {
        _id: messageId,
        receiverId: userId,
        isRead: false,
      },
      { isRead: true },
      { new: true }
    );

    if (!message) {
      throw new Error("Message not found or unauthorized");
    }

    const messageInstance = new MessageClass(
      message._id,
      message.senderId,
      message.receiverId,
      message.content,
      message.createdAt
    );
    messageInstance.markAsRead();
    return messageInstance.getSummary();
  },
};

module.exports = MessageService;
