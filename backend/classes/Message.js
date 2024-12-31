class Message {
  constructor(
    id,
    senderId,
    receiverId,
    content,
    images = [],
    isRead = false,
    isReported = false,
    reportStatus = "none",
    createdAt = new Date()
  ) {
    this._id = id;
    this._senderId = senderId;
    this._receiverId = receiverId;
    this._content = content;
    this._images = images;
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

  get images() {
    return this._images;
  }

  // Setter for Content
  set content(newContent) {
    if (!newContent && this._images.length === 0) {
      throw new Error("Message must have either content or images.");
    }
    this._content = newContent;
  }

  // Add/Remove images
  addImage(imageUrl) {
    this._images.push(imageUrl);
  }

  removeImage(imageUrl) {
    this._images = this._images.filter((img) => img !== imageUrl);
  }

  // Get message preview text
  getPreviewText() {
    if (this._images.length > 0) {
      return this._images.length === 1
        ? "📷 Sent an image"
        : `📷 Sent ${this._images.length} images`;
    }
    return this._content;
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
      images: this._images,
      isRead: this._isRead,
      isReported: this._isReported,
      reportStatus: this._reportStatus,
      createdAt: this._createdAt,
      previewText: this.getPreviewText(),
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
