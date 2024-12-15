const crypto = require("crypto"); // For secure random token generation

class Token {
  constructor(userId, expiresInMinutes = 15) {
    this._userId = userId; // Associate token with a specific user
    this._tokenValue = Token.generateToken(); // Generate the token value
    this._createdAt = new Date(); // Creation timestamp
    this._expiresAt = new Date(
      this._createdAt.getTime() + expiresInMinutes * 60000
    ); // Calculate expiration time
  }

  // Getter for Token Value
  get tokenValue() {
    return this._tokenValue;
  }

  // Getter for Expiration Time
  get expiresAt() {
    return this._expiresAt;
  }

  // Check if Token is Expired
  isExpired() {
    return new Date() > this._expiresAt;
  }

  // Static Method to Generate a Random Token
  static generateToken() {
    return crypto.randomBytes(32).toString("hex"); // 64-character hexadecimal string
  }
}

module.exports = Token;
