const MessageClass = require("../classes/Message");
const MessageModel = require("../models/messageSchema");
const UserModel = require("../models/userSchema");
const globalPolicySettingsService = require("../services/globalPolicySettingsService");
const DisputeModel = require("../models/disputeSchema");

const MessageService = {
  async createMessage(senderId, receiverId, content) {
    try {
      // Verify both users exist
      const [sender, receiver] = await Promise.all([
        UserModel.findById(senderId),
        UserModel.findById(receiverId),
      ]);

      if (!sender || !receiver) {
        const error = new Error("Sender or receiver not found");
        error.statusCode = 404;
        throw error;
      }

      // Check if user is banned
      if (sender.isBanned) {
        const error = new Error("Account has been banned");
        error.statusCode = 403;
        throw error;
      }

      // Check if user is under review
      if (sender.isUnderReview) {
        const error = new Error("Account is under review");
        error.statusCode = 403;
        throw error;
      }

      // Check if user has too many disputes
      const maxDisputesPolicy =
        await globalPolicySettingsService.getPolicyByName(
          "maxDisputesBeforeBan"
        );
      if (maxDisputesPolicy) {
        const userDisputes = await DisputeModel.countDocuments({
          reportedId: senderId,
          status: "resolved",
          resolution: { $in: ["warning", "ban"] },
        });

        if (userDisputes >= maxDisputesPolicy.value) {
          // Ban the user
          await UserModel.findByIdAndUpdate(senderId, {
            isBanned: true,
            banReason: "Exceeded maximum allowed disputes",
          });

          const error = new Error("Account has been banned");
          error.statusCode = 403;
          throw error;
        }
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
      return new MessageClass(
        savedMessage._id,
        savedMessage.senderId,
        savedMessage.receiverId,
        savedMessage.content,
        savedMessage.isRead,
        savedMessage.isReported,
        savedMessage.reportStatus,
        savedMessage.createdAt
      ).getSummary();
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }
      const newError = new Error(`Error creating message: ${error.message}`);
      newError.statusCode = 500;
      throw newError;
    }
  },

  async getUserMessages(userId) {
    try {
      const messages = await MessageModel.find({
        $or: [{ senderId: userId }, { receiverId: userId }],
      }).sort({ createdAt: -1 });

      return messages.map((msg) =>
        new MessageClass(
          msg._id,
          msg.senderId,
          msg.receiverId,
          msg.content,
          msg.isRead,
          msg.isReported,
          msg.reportStatus,
          msg.createdAt
        ).getSummary()
      );
    } catch (error) {
      throw new Error(`Error getting messages: ${error.message}`);
    }
  },

  async markMessageAsRead(messageId, userId) {
    try {
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

      return new MessageClass(
        message._id,
        message.senderId,
        message.receiverId,
        message.content,
        message.isRead,
        message.isReported,
        message.reportStatus,
        message.createdAt
      ).getSummary();
    } catch (error) {
      throw new Error(`Error marking message as read: ${error.message}`);
    }
  },

  // New method for system messages
  async sendSystemMessage(userId, content) {
    try {
      const systemMessage = await MessageModel.create({
        senderId: "system",
        receiverId: userId,
        content,
        isRead: false,
      });

      return systemMessage;
    } catch (error) {
      throw new Error(`Error sending system message: ${error.message}`);
    }
  },
};

module.exports = MessageService;
