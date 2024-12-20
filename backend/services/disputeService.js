const DisputeClass = require("../classes/Dispute");
const DisputeModel = require("../models/disputeSchema");

const DisputeService = {
  async createDispute(itemId, buyerId, sellerId, reason) {
    const disputeClassInstance = new DisputeClass(
      null,
      itemId,
      buyerId,
      sellerId,
      reason
    );

    const disputeDocument = new DisputeModel({
      itemId: disputeClassInstance._itemId,
      buyerId: disputeClassInstance._buyerId,
      sellerId: disputeClassInstance._sellerId,
      reason: disputeClassInstance.reason,
      resolutionStatus: disputeClassInstance.resolutionStatus,
      createdAt: disputeClassInstance.createdAt,
    });

    const savedDispute = await disputeDocument.save();
    return new DisputeClass(
      savedDispute._id,
      savedDispute.itemId,
      savedDispute.buyerId,
      savedDispute.sellerId,
      savedDispute.reason,
      savedDispute.createdAt
    );
  },

  async getDisputeById(disputeId) {
    const dispute = await DisputeModel.findById(disputeId);
    if (!dispute) return null;

    return new DisputeClass(
      dispute._id,
      dispute.itemId,
      dispute.buyerId,
      dispute.sellerId,
      dispute.reason,
      dispute.createdAt
    );
  },

  async updateDisputeStatus(disputeId, status) {
    const dispute = await DisputeModel.findById(disputeId);
    if (!dispute) return null;

    dispute.resolutionStatus = status;
    if (status === "Resolved") {
      dispute.resolvedAt = new Date();
    }

    const updatedDispute = await dispute.save();
    return new DisputeClass(
      updatedDispute._id,
      updatedDispute.itemId,
      updatedDispute.buyerId,
      updatedDispute.sellerId,
      updatedDispute.reason,
      updatedDispute.createdAt
    );
  },

  async getDisputesByUser(userId) {
    const disputes = await DisputeModel.find({
      $or: [{ buyerId: userId }, { sellerId: userId }],
    }).sort({ createdAt: -1 });

    return disputes.map(
      (dispute) =>
        new DisputeClass(
          dispute._id,
          dispute.itemId,
          dispute.buyerId,
          dispute.sellerId,
          dispute.reason,
          dispute.createdAt
        )
    );
  },

  async getAllDisputes() {
    const disputes = await DisputeModel.find().sort({ createdAt: -1 });
    return disputes.map(
      (dispute) =>
        new DisputeClass(
          dispute._id,
          dispute.itemId,
          dispute.buyerId,
          dispute.sellerId,
          dispute.reason,
          dispute.createdAt
        )
    );
  },
};

module.exports = DisputeService;
