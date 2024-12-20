class Message {
  constructor(id, senderId, receiverId, content, createdAt = new Date()) {
    this._id = id;
    this._senderId = senderId;
    this._receiverId = receiverId;
    this._content = content;
    this._isRead = false;
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

  // Get message summary
  getSummary() {
    return {
      _id: this._id,
      senderId: this._senderId,
      receiverId: this._receiverId,
      content: this._content,
      isRead: this._isRead,
      createdAt: this._createdAt,
    };
  }
}

module.exports = Message;
