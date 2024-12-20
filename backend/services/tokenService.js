const TokenClass = require("../classes/Token");
const TokenModel = require("../models/tokenSchema");

const TokenService = {
  async createToken(userId, type = "verification", expiresInMinutes = 15) {
    const tokenClassInstance = new TokenClass(userId, expiresInMinutes);

    const tokenDocument = new TokenModel({
      userId: tokenClassInstance._userId,
      tokenValue: tokenClassInstance.tokenValue,
      type,
      expiresAt: tokenClassInstance.expiresAt,
    });

    const savedToken = await tokenDocument.save();
    return new TokenClass(savedToken.userId, expiresInMinutes);
  },

  async verifyToken(tokenValue, type) {
    const token = await TokenModel.findOne({ tokenValue, type });
    if (!token) return null;

    const tokenClassInstance = new TokenClass(token.userId);
    tokenClassInstance._tokenValue = token.tokenValue;

    if (tokenClassInstance.isExpired()) {
      await TokenModel.deleteOne({ _id: token._id });
      return null;
    }

    return tokenClassInstance;
  },

  async deleteToken(tokenValue) {
    const result = await TokenModel.deleteOne({ tokenValue });
    return result.deletedCount > 0;
  },

  async deleteAllUserTokens(userId, type) {
    const result = await TokenModel.deleteMany({ userId, type });
    return result.deletedCount;
  },

  async getValidTokenByUserId(userId, type) {
    const token = await TokenModel.findOne({
      userId,
      type,
      expiresAt: { $gt: new Date() },
    });

    if (!token) return null;

    return new TokenClass(token.userId);
  },
};

module.exports = TokenService;
