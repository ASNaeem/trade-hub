const crypto = require("crypto"); // For secure random token generation
class Token {
  constructor(id, userId, tokenValue, expiresInMinutes = 15) {
    this._id = id;
    this._userId = userId;
    this._tokenValue = tokenValue;
    this._createdAt = new Date();
    this._expiresAt = new Date(
      this._createdAt.getTime() + expiresInMinutes * 60000
    ); // Calculate expiration time
  }

  // Getter for Token Value
  get tokenValue() {
    return this._tokenValue;
  }

  // Setter for Token Value
  set tokenValue(newToken) {
    if (!newToken || newToken.length < 16) {
      throw new Error("Token must be at least 16 characters long.");
    }
    this._tokenValue = newToken;
  }

  // Getter for Expiration
  get expiresAt() {
    return this._expiresAt;
  }

  // Check if Token is Expired
  isExpired() {
    return new Date() > this._expiresAt;
  }
  generateToken() {
    return crypto.randomBytes(32).toString("hex"); // Generates a 64-character hexadecimal string
  }
}

module.exports = Token;
