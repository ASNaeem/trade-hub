const jwt = require("jsonwebtoken");
const config = require("../config/test.config");

module.exports = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header("Authorization");
    console.log("Auth header:", authHeader);

    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    // Check if it's a Bearer token
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    // Get the token part
    const token = authHeader.split(" ")[1];
    console.log("Extracted token:", token);

    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET);
    console.log("Decoded token:", decoded);

    // Add user info to request
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Token is not valid" });
  }
};
