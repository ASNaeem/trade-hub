const TokenClass = require("../classes/Token");
const TokenModel = require("../models/tokenSchema");

const TokenService = {
  generateOTP() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  },

  async createToken(userId, type = "verification", expiresInMinutes = 15) {
    let tokenValue;

    if (type === "verification") {
      tokenValue = this.generateOTP();
    } else {
      const tokenClassInstance = new TokenClass(userId, expiresInMinutes);
      tokenValue = tokenClassInstance.tokenValue;
    }

    const tokenDocument = new TokenModel({
      userId,
      tokenValue,
      type,
      expiresAt: new Date(Date.now() + expiresInMinutes * 60 * 1000),
    });

    const savedToken = await tokenDocument.save();
    return savedToken;
  },

  async verifyToken(token, type) {
    try {
      const tokenDoc = await TokenModel.findOne({ tokenValue: token, type });
      if (!tokenDoc) {
        return null;
      }

      if (new Date() > tokenDoc.expiresAt) {
        await TokenModel.deleteOne({ _id: tokenDoc._id });
        return null;
      }

      // Delete the token after successful verification
      await TokenModel.deleteOne({ _id: tokenDoc._id });
      return tokenDoc;
    } catch (error) {
      throw new Error(`Error verifying token: ${error.message}`);
    }
  },

  async findToken(token) {
    try {
      return await TokenModel.findOne({ tokenValue: token });
    } catch (error) {
      throw new Error(`Error finding token: ${error.message}`);
    }
  },

  async deleteToken(token) {
    try {
      const tokenDoc = await TokenModel.findOne({ tokenValue: token });
      if (!tokenDoc) {
        return false;
      }
      await TokenModel.deleteOne({ _id: tokenDoc._id });
      return true;
    } catch (error) {
      throw new Error(`Error deleting token: ${error.message}`);
    }
  },

  async deleteAllUserTokens(userId, type) {
    try {
      const result = await TokenModel.deleteMany({ userId, type });
      return result.deletedCount;
    } catch (error) {
      throw new Error(`Error deleting user tokens: ${error.message}`);
    }
  },

  async getValidTokenByUserId(userId, type) {
    try {
      const token = await TokenModel.findOne({
        userId,
        type,
        expiresAt: { $gt: new Date() },
      });

      if (!token) return null;

      return new TokenClass(token.userId);
    } catch (error) {
      throw new Error(`Error getting valid token: ${error.message}`);
    }
  },
};

module.exports = TokenService;
