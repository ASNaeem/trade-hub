class Message {
  constructor(id, senderId, receiverId, content, createdAt = new Date()) {
    this._id = id;
    this._senderId = senderId;
    this._receiverId = receiverId;
    this._content = content;
    this._isRead = false;
    this._createdAt = createdAt;
  }

  // Getter for Content
  get content() {
    return this._content;
  }

  // Setter for Content
  set content(newContent) {
    if (!newContent || newContent.length === 0) {
      throw new Error("Message content cannot be empty.");
    }
    this._content = newContent;
  }

  // Getter for Read Status
  get isRead() {
    return this._isRead;
  }

  // Mark Message as Read
  markAsRead() {
    this._isRead = true;
  }
}

module.exports = Message;
