const ItemClass = require("../classes/Item");
const ItemModel = require("../models/itemSchema");
const UserModel = require("../models/userSchema");
const globalPolicySettingsService = require("../services/globalPolicySettingsService");

const ItemService = {
  async createItem(itemData, userId) {
    try {
      // Get user to check verification status
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      // Convert image data if it's a blob URL
      if (itemData.images) {
        console.log(
          "Processing images in backend:",
          itemData.images.map((img) => ({
            type: img.type,
            hasData: !!img.data,
            hasUrl: !!img.url,
            contentType: img.contentType,
            dataPreview: img.data?.substring(0, 100) + "...",
          }))
        );

        itemData.images = itemData.images.map((image) => {
          // Ensure we're using the correct type and data
          if (image.type === "base64" && image.data) {
            return {
              type: "base64",
              data: image.data,
              contentType: image.contentType || "image/jpeg",
              url: null,
            };
          }
          return image;
        });

        console.log(
          "Processed images:",
          itemData.images.map((img) => ({
            type: img.type,
            hasData: !!img.data,
            hasUrl: !!img.url,
            contentType: img.contentType,
          }))
        );
      }

      // Prepare complete item data
      const completeItemData = {
        ...itemData,
        sellerId: userId,
        price: Number(itemData.price),
      };

      // Enforce policies before creating item
      await globalPolicySettingsService.enforceItemPolicies(
        userId,
        completeItemData,
        user.isVerified
      );

      const itemClassInstance = new ItemClass(
        null,
        itemData.title,
        itemData.description,
        completeItemData.price,
        itemData.brand || null,
        itemData.category,
        itemData.condition,
        itemData.images || [],
        itemData.location,
        userId,
        new Date()
      );

      const itemDocument = new ItemModel({
        title: itemClassInstance.title,
        description: itemClassInstance.description,
        price: itemClassInstance.price,
        brand: itemClassInstance.brand,
        category: itemClassInstance.category,
        condition: itemClassInstance.condition,
        location: itemClassInstance.location,
        images: itemClassInstance.images,
        sellerId: itemClassInstance.sellerId,
        createdAt: itemClassInstance.createdAt,
      });

      const savedItem = await itemDocument.save();
      console.log(
        "Saved item images:",
        savedItem.images.map((img) => ({
          type: img.type,
          hasData: !!img.data,
          hasUrl: !!img.url,
          contentType: img.contentType,
        }))
      );

      return new ItemClass(
        savedItem._id,
        savedItem.title,
        savedItem.description,
        savedItem.price,
        savedItem.brand,
        savedItem.category,
        savedItem.condition,
        savedItem.images,
        savedItem.location,
        savedItem.sellerId,
        savedItem.createdAt
      ).getSummary();
    } catch (error) {
      console.error("Error in createItem:", error);
      throw error;
    }
  },

  async getAllItems(filters = {}) {
    try {
      const {
        page = 1,
        limit = 6,
        category,
        brand,
        brands = [],
        minPrice,
        maxPrice,
        conditions = [],
        locations = [],
        search = "",
      } = filters;

      const query = {};

      // Handle search
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { brand: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
        ];
      }

      if (category) {
        query.category = category;
      }

      // Handle brand filtering
      if (brands.length > 0) {
        const mainBrands = ["Levi's", "Fossil", "Sony", "Apple", "Dell"];
        if (brands.includes("Other")) {
          query.$or = [
            { brand: { $nin: mainBrands } },
            { brand: null },
            { brand: { $in: brands.filter((b) => b !== "Other") } },
          ];
        } else {
          query.brand = { $in: brands };
        }
      } else if (brand) {
        query.brand = brand;
      }

      // Handle condition filtering
      if (conditions.length > 0) {
        query.condition = { $in: conditions };
      }

      // Handle location filtering
      if (locations.length > 0) {
        query.location = { $in: locations };
      }

      // Handle price range filtering
      if (minPrice !== undefined || maxPrice !== undefined) {
        query.price = {};
        if (minPrice !== undefined) {
          query.price.$gte = Number(minPrice);
        }
        if (maxPrice !== undefined) {
          query.price.$lte = Number(maxPrice);
        }
      }

      // Count total documents for pagination
      const totalItems = await ItemModel.countDocuments(query);
      const totalPages = Math.ceil(totalItems / limit);
      const skip = (page - 1) * limit;

      // Get paginated items
      const items = await ItemModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      return {
        items: items.map((item) =>
          new ItemClass(
            item._id,
            item.title,
            item.description,
            item.price,
            item.brand,
            item.category,
            item.condition,
            item.images,
            item.location,
            item.sellerId,
            item.createdAt
          ).getSummary()
        ),
        totalPages,
        currentPage: page,
        totalItems,
      };
    } catch (error) {
      throw new Error(`Error getting items: ${error.message}`);
    }
  },

  async getItemById(itemId) {
    try {
      const item = await ItemModel.findById(itemId);
      if (!item) return null;

      return new ItemClass(
        item._id,
        item.title,
        item.description,
        item.price,
        item.brand,
        item.category,
        item.condition,
        item.images,
        item.location,
        item.sellerId,
        item.createdAt
      ).getSummary();
    } catch (error) {
      throw new Error(`Error getting item: ${error.message}`);
    }
  },

  async updateItem(itemId, updates, userId) {
    try {
      const item = await ItemModel.findById(itemId);
      if (!item) {
        throw new Error("Item not found");
      }

      // Check if user is the seller
      if (item.sellerId.toString() !== userId.toString()) {
        const error = new Error("Not authorized to update this item");
        error.statusCode = 403;
        throw error;
      }

      // Get user to check verification status
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      // If price is being updated, enforce price-related policies
      if (updates.price !== undefined) {
        await globalPolicySettingsService.enforceItemPolicies(
          userId,
          {
            ...item.toObject(),
            ...updates,
            price: Number(updates.price),
          },
          user.isVerified
        );
      }

      const updatedItem = await ItemModel.findByIdAndUpdate(
        itemId,
        { $set: updates },
        { new: true }
      );

      return new ItemClass(
        updatedItem._id,
        updatedItem.title,
        updatedItem.description,
        updatedItem.price,
        updatedItem.brand,
        updatedItem.category,
        updatedItem.condition,
        updatedItem.images,
        updatedItem.location,
        updatedItem.sellerId,
        updatedItem.createdAt
      ).getSummary();
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }
      throw new Error(`Error updating item: ${error.message}`);
    }
  },

  async deleteItem(itemId, userId) {
    try {
      const item = await ItemModel.findById(itemId);
      if (!item) {
        return { success: true, message: "Item deleted successfully" };
      }

      // Check if user is the seller
      if (item.sellerId.toString() !== userId.toString()) {
        const error = new Error("Not authorized to delete this item");
        error.statusCode = 403;
        throw error;
      }

      await ItemModel.findByIdAndDelete(itemId);
      return { success: true, message: "Item deleted successfully" };
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }
      throw new Error(`Error deleting item: ${error.message}`);
    }
  },

  async getSimilarItems(itemId, filters = {}) {
    try {
      const {
        category,
        minPrice,
        maxPrice,
        conditions = [],
        locations = [],
        limit = 4,
      } = filters;

      // Build the query
      const query = {
        _id: { $ne: itemId }, // Exclude the current item
      };

      if (category) {
        query.category = category;
      }

      if (minPrice !== undefined || maxPrice !== undefined) {
        query.price = {};
        if (minPrice !== undefined) {
          query.price.$gte = Number(minPrice);
        }
        if (maxPrice !== undefined) {
          query.price.$lte = Number(maxPrice);
        }
      }

      if (conditions.length > 0) {
        query.condition = { $in: conditions };
      }

      if (locations.length > 0) {
        query.location = { $in: locations };
      }

      // Find similar items
      const items = await ItemModel.find(query)
        .sort({ createdAt: -1 }) // Sort by newest first
        .limit(limit);

      // If we don't have enough items, try a broader search without location constraint
      if (items.length < limit) {
        delete query.location;
        const additionalItems = await ItemModel.find({
          ...query,
          _id: {
            $ne: itemId, // Keep excluding the current item
            $nin: items.map((item) => item._id), // Also exclude items we already have
          },
        })
          .sort({ createdAt: -1 })
          .limit(limit - items.length);

        items.push(...additionalItems);
      }

      // Convert to class instances and return summaries
      return items.map((item) =>
        new ItemClass(
          item._id,
          item.title,
          item.description,
          item.price,
          item.brand,
          item.category,
          item.condition,
          item.images,
          item.location,
          item.sellerId,
          item.createdAt
        ).getSummary()
      );
    } catch (error) {
      throw new Error(`Error getting similar items: ${error.message}`);
    }
  },

  async getItemsBySellerId(sellerId) {
    try {
      const items = await ItemModel.find({ sellerId: sellerId });
      return items.map((item) =>
        new ItemClass(
          item._id,
          item.title,
          item.description,
          item.price,
          item.brand,
          item.category,
          item.condition,
          item.images,
          item.location,
          item.sellerId,
          item.createdAt
        ).getSummary()
      );
    } catch (error) {
      console.error("Error getting items by seller ID:", error);
      throw error;
    }
  },
};

module.exports = ItemService;
