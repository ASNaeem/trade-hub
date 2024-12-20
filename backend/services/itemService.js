const ItemModel = require("../models/itemSchema");
const ItemClass = require("../classes/Item");

const ItemService = {
  async createItem(itemData) {
    const itemClassInstance = new ItemClass(
      null,
      itemData.title,
      itemData.description,
      itemData.price,
      itemData.brand,
      itemData.category,
      itemData.condition,
      itemData.images,
      itemData.location,
      itemData.sellerId
    );

    itemClassInstance.validate();

    const itemDocument = new ItemModel({
      title: itemClassInstance.title,
      description: itemClassInstance.description,
      price: itemClassInstance.price,
      brand: itemClassInstance.brand,
      category: itemClassInstance.category,
      condition: itemClassInstance.condition,
      images: itemClassInstance.images,
      location: itemClassInstance.location,
      sellerId: itemClassInstance.sellerId,
      createdAt: itemClassInstance.createdAt,
    });

    const savedItem = await itemDocument.save();
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
    );
  },

  async getAllItems() {
    const items = await ItemModel.find();
    return items.map(
      (item) =>
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
        )
    );
  },

  async getItemById(itemId) {
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
    );
  },

  async updateItem(itemId, updates) {
    const item = await ItemModel.findById(itemId);
    if (!item) return null;

    // Update only the fields that are provided
    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined) {
        item[key] = updates[key];
      }
    });

    const updatedItem = await item.save();

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
    );
  },

  async deleteItem(itemId) {
    const deletedItem = await ItemModel.findByIdAndDelete(itemId);
    if (!deletedItem) return null;

    return new ItemClass(
      deletedItem._id,
      deletedItem.title,
      deletedItem.description,
      deletedItem.price,
      deletedItem.brand,
      deletedItem.category,
      deletedItem.condition,
      deletedItem.images,
      deletedItem.location,
      deletedItem.sellerId,
      deletedItem.createdAt
    );
  }
};

module.exports = ItemService;
