class Message {
  constructor(
    id,
    senderId,
    receiverId,
    content,
    isRead = false,
    isReported = false,
    reportStatus = "none",
    createdAt = new Date()
  ) {
    this._id = id;
    this._senderId = senderId;
    this._receiverId = receiverId;
    this._content = content;
    this._isRead = isRead;
    this._isReported = isReported;
    this._reportStatus = reportStatus;
    this._createdAt = createdAt;
  }

  // Getters
  get id() {
    return this._id;
  }

  get senderId() {
    return this._senderId;
  }

  get receiverId() {
    return this._receiverId;
  }

  get content() {
    return this._content;
  }

  get isRead() {
    return this._isRead;
  }

  get createdAt() {
    return this._createdAt;
  }

  get isReported() {
    return this._isReported;
  }

  get reportStatus() {
    return this._reportStatus;
  }

  // Setter for Content
  set content(newContent) {
    if (!newContent || newContent.length === 0) {
      throw new Error("Message content cannot be empty.");
    }
    this._content = newContent;
  }

  // Mark Message as Read
  markAsRead() {
    this._isRead = true;
  }

  // New method for reporting
  markAsReported() {
    this._isReported = true;
    this._reportStatus = "pending";
  }

  // New method for updating report status
  updateReportStatus(status) {
    if (!["none", "pending", "resolved"].includes(status)) {
      throw new Error("Invalid report status");
    }
    this._reportStatus = status;
  }

  // Get message summary
  getSummary() {
    return {
      _id: this._id,
      senderId: this._senderId,
      receiverId: this._receiverId,
      content: this._content,
      isRead: this._isRead,
      isReported: this._isReported,
      reportStatus: this._reportStatus,
      createdAt: this._createdAt,
    };
  }

  // Helper method for system messages
  static createSystemMessage(receiverId, content, metadata = {}) {
    return new Message(
      null,
      "system",
      "System",
      receiverId,
      "User",
      content,
      "system",
      metadata
    );
  }

  // Helper method for support messages
  static createSupportMessage(adminId, userId, content, metadata = {}) {
    return new Message(
      null,
      adminId,
      "Admin",
      userId,
      "User",
      content,
      "support",
      metadata
    );
  }
}

module.exports = Message;
