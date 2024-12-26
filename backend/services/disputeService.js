const DisputeClass = require("../classes/Dispute");
const DisputeModel = require("../models/disputeSchema");
const MessageModel = require("../models/messageSchema");
const ItemModel = require("../models/itemSchema");
const UserModel = require("../models/userSchema");
const globalPolicySettingsService = require("../services/globalPolicySettingsService");

const DisputeService = {
  async reportContent(reportType, targetId, reporterId, reason, description) {
    try {
      // Check if the content exists and get the reported user's ID
      let reportedId;
      if (reportType === "message") {
        const message = await MessageModel.findById(targetId);
        if (!message) {
          const error = new Error("Message not found");
          error.statusCode = 404;
          throw error;
        }
        reportedId = message.senderId.toString();

        // Check if message is already reported
        if (message.isReported) {
          const error = new Error("Message is already reported");
          error.statusCode = 400;
          throw error;
        }

        // Update message status
        await MessageModel.findByIdAndUpdate(targetId, {
          isReported: true,
          reportStatus: "pending",
        });
      } else if (reportType === "item") {
        const item = await ItemModel.findById(targetId);
        if (!item) {
          const error = new Error("Item not found");
          error.statusCode = 404;
          throw error;
        }
        reportedId = item.sellerId.toString();

        // Check if item is already reported
        if (item.isReported) {
          const error = new Error("Item is already reported");
          error.statusCode = 400;
          throw error;
        }

        // Update item status
        await ItemModel.findByIdAndUpdate(targetId, {
          isReported: true,
          reportStatus: "pending",
        });
      }

      // Create the dispute
      const dispute = await DisputeModel.create({
        reportType,
        targetId,
        reporterId,
        reportedId,
        reason,
        description,
        status: "open",
      });

      // Check if user has reached the report threshold
      const maxReportsPolicy =
        await globalPolicySettingsService.getPolicyByName(
          "maxReportsBeforeReview"
        );

      if (maxReportsPolicy) {
        const userReports = await DisputeModel.countDocuments({
          reportedId,
          status: "open",
        });

        if (userReports >= maxReportsPolicy.value) {
          // Update user status to under review
          await UserModel.findByIdAndUpdate(reportedId, {
            isUnderReview: true,
          });

          // Update all pending messages to rejected
          await MessageModel.updateMany(
            { senderId: reportedId, reportStatus: "pending" },
            { reportStatus: "rejected" }
          );

          // Update all pending items to rejected
          await ItemModel.updateMany(
            { sellerId: reportedId, reportStatus: "pending" },
            { reportStatus: "rejected" }
          );

          const error = new Error(
            "User has reached the report threshold. Account under review."
          );
          error.statusCode = 400;
          throw error;
        }
      }

      // Check if user has reached the dispute threshold
      const maxDisputesPolicy =
        await globalPolicySettingsService.getPolicyByName(
          "maxDisputesBeforeBan"
        );

      if (maxDisputesPolicy) {
        const userDisputes = await DisputeModel.countDocuments({
          reportedId,
          status: "resolved",
          resolution: { $in: ["warning", "ban"] },
        });

        if (userDisputes >= maxDisputesPolicy.value) {
          // Ban the user
          await UserModel.findByIdAndUpdate(reportedId, {
            isBanned: true,
            banReason: "Exceeded maximum allowed disputes",
          });

          // Update all pending messages to rejected
          await MessageModel.updateMany(
            { senderId: reportedId, reportStatus: "pending" },
            { reportStatus: "rejected" }
          );

          // Update all pending items to rejected
          await ItemModel.updateMany(
            { sellerId: reportedId, reportStatus: "pending" },
            { reportStatus: "rejected" }
          );

          const error = new Error("Account has been banned");
          error.statusCode = 403;
          throw error;
        }
      }

      return dispute;
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }
      const newError = new Error(`Error creating dispute: ${error.message}`);
      newError.statusCode = 500;
      throw newError;
    }
  },

  async resolveDispute(disputeId, adminId, resolution, note) {
    try {
      const dispute = await DisputeModel.findById(disputeId);
      if (!dispute) {
        const error = new Error("Dispute not found");
        error.statusCode = 404;
        throw error;
      }

      // Update dispute status
      dispute.status = "resolved";
      dispute.resolution = resolution;
      dispute.adminNote = note;
      dispute.resolvedAt = new Date();
      dispute.resolvedBy = adminId;
      await dispute.save();

      // Update the reported content's status
      if (dispute.reportType === "message") {
        await MessageModel.findByIdAndUpdate(dispute.targetId, {
          reportStatus: "resolved",
        });
      } else if (dispute.reportType === "item") {
        await ItemModel.findByIdAndUpdate(dispute.targetId, {
          reportStatus: "resolved",
        });
      }

      // Check if user has reached the dispute threshold
      const maxDisputesPolicy =
        await globalPolicySettingsService.getPolicyByName(
          "maxDisputesBeforeBan"
        );
      if (maxDisputesPolicy) {
        const userDisputes = await DisputeModel.countDocuments({
          reportedId: dispute.reportedId,
          status: "resolved",
          resolution: { $in: ["warning", "ban"] },
        });

        if (userDisputes >= maxDisputesPolicy.value) {
          // Ban the user
          await UserModel.findByIdAndUpdate(dispute.reportedId, {
            isBanned: true,
            banReason: "Exceeded maximum allowed disputes",
          });

          // Update all pending messages to rejected
          await MessageModel.updateMany(
            { senderId: dispute.reportedId, reportStatus: "pending" },
            { reportStatus: "rejected" }
          );

          // Update all pending items to rejected
          await ItemModel.updateMany(
            { sellerId: dispute.reportedId, reportStatus: "pending" },
            { reportStatus: "rejected" }
          );
        }
      }

      return dispute;
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }
      const newError = new Error(`Error resolving dispute: ${error.message}`);
      newError.statusCode = 500;
      throw newError;
    }
  },

  async getUserDisputes(userId) {
    try {
      return await DisputeModel.find({
        $or: [{ reporterId: userId }, { reportedId: userId }],
      })
        .sort({ createdAt: -1 })
        .populate("reporterId", "name email")
        .populate("reportedId", "name email")
        .populate("resolvedBy", "name email");
    } catch (error) {
      const newError = new Error(
        `Error getting user disputes: ${error.message}`
      );
      newError.statusCode = 500;
      throw newError;
    }
  },

  async getDisputeById(disputeId) {
    try {
      const dispute = await DisputeModel.findById(disputeId)
        .populate("reporterId", "name email")
        .populate("reportedId", "name email")
        .populate("resolvedBy", "name email");
      if (!dispute) {
        const error = new Error("Dispute not found");
        error.statusCode = 404;
        throw error;
      }
      return dispute;
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }
      const newError = new Error(`Error getting dispute: ${error.message}`);
      newError.statusCode = 500;
      throw newError;
    }
  },

  async getAllDisputes(filters = {}) {
    try {
      const query = {};

      if (filters.status) {
        query.status = filters.status;
      }

      if (filters.reportType) {
        query.reportType = filters.reportType;
      }

      return await DisputeModel.find(query)
        .sort({ createdAt: -1 })
        .populate("reporterId", "name email")
        .populate("reportedId", "name email")
        .populate("resolvedBy", "name email");
    } catch (error) {
      const newError = new Error(`Error getting disputes: ${error.message}`);
      newError.statusCode = 500;
      throw newError;
    }
  },
};

module.exports = DisputeService;
