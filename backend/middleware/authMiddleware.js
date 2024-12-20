const jwt = require("jsonwebtoken");
const config = require("../config/test.config");

const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    // Verify token
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, config.JWT_SECRET);

    // Add user info to request
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
