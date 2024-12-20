// sellerCheck.js
const Item = require("../models/itemSchema"); // Using the Mongoose schema

module.exports = async (req, res, next) => {
  if (req.params.itemId) {
    try {
      // Fetch the item by ID
      const item = await Item.findById(req.params.itemId);

      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      // Check if the logged-in user is the seller of the item
      if (item.sellerId.toString() !== req.user.id.toString()) {
        return res
          .status(403)
          .json({
            message: "You do not have permission to edit or delete this item",
          });
      }

      // If the seller check passes, proceed to the next middleware or route handler
      next();
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error verifying item seller", error: error.message });
    }
  } else {
    next(); // If no itemId is provided, proceed to the next middleware (e.g., for other routes like user profile)
  }
};
