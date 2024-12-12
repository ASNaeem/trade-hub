class Dispute {
  constructor(id, itemId, buyerId, sellerId, reason, createdAt = new Date()) {
    this._id = id;
    this._itemId = itemId;
    this._buyerId = buyerId;
    this._sellerId = sellerId;
    this._reason = reason;
    this._resolutionStatus = "Pending"; // Default status
    this._createdAt = createdAt;
    this._resolvedAt = null; // To track when the dispute was resolved
  }

  // Getter for Reason
  get reason() {
    return this._reason;
  }

  // Setter for Reason
  set reason(newReason) {
    if (!newReason || newReason.length < 10) {
      throw new Error("Reason must be at least 10 characters long.");
    }
    this._reason = newReason;
  }

  // Getter for Resolution Status
  get resolutionStatus() {
    return this._resolutionStatus;
  }

  // Setter for Resolution Status
  set resolutionStatus(status) {
    const validStatuses = ["Pending", "Resolved", "Rejected"];
    if (!validStatuses.includes(status)) {
      throw new Error(`Status must be one of: ${validStatuses.join(", ")}`);
    }
    this._resolutionStatus = status;
    if (status === "Resolved") {
      this._resolvedAt = new Date(); // Automatically set resolvedAt timestamp
    }
  }

  // Getter for Resolved At
  get resolvedAt() {
    return this._resolvedAt;
  }

  // Getter for Created At
  get createdAt() {
    return this._createdAt;
  }
}

module.exports = Dispute;
