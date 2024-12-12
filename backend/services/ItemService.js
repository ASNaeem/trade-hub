const ItemModel = require("../models/itemSchema"); // Mongoose schema
const Item = require("../classes/Item"); // Custom Item class

// Save a new item
async function save(item) {
  // Convert the custom Item class instance to a Mongoose document
  const itemDocument = new ItemModel({
    _id: item.itemId,
    title: item.title,
    description: item.description,
    price: item.price,
    brand: item.brand,
    category: item.category,
    condition: item.condition,
    images: item.images,
    visibility_status: item.visibilityStatus === "visible", // Convert string to boolean
    created_at: item.createdAt,
    location: item.location,
  });

  try {
    const savedItem = await itemDocument.save();
    return new Item(
      savedItem._id,
      savedItem.title,
      savedItem.description,
      savedItem.price,
      savedItem.brand,
      savedItem.category,
      savedItem.condition,
      savedItem.images,
      savedItem.visibility_status ? "visible" : "hidden", // Convert boolean back to string
      savedItem.created_at,
      savedItem.location
    );
  } catch (error) {
    throw new Error("Error saving item: " + error.message);
  }
}

// Find an item by ID
async function findById(itemId) {
  const itemDocument = await ItemModel.findById(itemId);
  if (!itemDocument) {
    throw new Error("Item not found");
  }

  // Convert the Mongoose document to an instance of the custom Item class
  return new Item(
    itemDocument._id,
    itemDocument.title,
    itemDocument.description,
    itemDocument.price,
    itemDocument.brand,
    itemDocument.category,
    itemDocument.condition,
    itemDocument.images,
    itemDocument.visibility_status ? "visible" : "hidden",
    itemDocument.created_at,
    itemDocument.location
  );
}

// Find all items
async function findAll() {
  const itemDocuments = await ItemModel.find();
  return itemDocuments.map((doc) =>
    new Item(
      doc._id,
      doc.title,
      doc.description,
      doc.price,
      doc.brand,
      doc.category,
      doc.condition,
      doc.images,
      doc.visibility_status ? "visible" : "hidden",
      doc.created_at,
      doc.location
    )
  );
}

// Filter items by location
async function filterByLocation(location) {
  const itemDocuments = await ItemModel.find({ location });
  return itemDocuments.map((doc) =>
    new Item(
      doc._id,
      doc.title,
      doc.description,
      doc.price,
      doc.brand,
      doc.category,
      doc.condition,
      doc.images,
      doc.visibility_status ? "visible" : "hidden",
      doc.created_at,
      doc.location
    )
  );
}

// Filter items by category
async function filterByCategory(category) {
  const itemDocuments = await ItemModel.find({ category });
  return itemDocuments.map((doc) =>
    new Item(
      doc._id,
      doc.title,
      doc.description,
      doc.price,
      doc.brand,
      doc.category,
      doc.condition,
      doc.images,
      doc.visibility_status ? "visible" : "hidden",
      doc.created_at,
      doc.location
    )
  );
}

// Filter items by condition
async function filterByCondition(condition) {
  const itemDocuments = await ItemModel.find({ condition });
  return itemDocuments.map((doc) =>
    new Item(
      doc._id,
      doc.title,
      doc.description,
      doc.price,
      doc.brand,
      doc.category,
      doc.condition,
      doc.images,
      doc.visibility_status ? "visible" : "hidden",
      doc.created_at,
      doc.location
    )
  );
}

// Filter items by price range
async function filterByPrice(minPrice, maxPrice) {
  const itemDocuments = await ItemModel.find({
    price: { $gte: minPrice, $lte: maxPrice },
  });
  return itemDocuments.map((doc) =>
    new Item(
      doc._id,
      doc.title,
      doc.description,
      doc.price,
      doc.brand,
      doc.category,
      doc.condition,
      doc.images,
      doc.visibility_status ? "visible" : "hidden",
      doc.created_at,
      doc.location
    )
  );
}

// Sort items
async function sortItems(sortBy, sortOrder = "asc") {
  const sortOrderValue = sortOrder === "desc" ? -1 : 1;
  const itemDocuments = await ItemModel.find().sort({ [sortBy]: sortOrderValue });
  return itemDocuments.map((doc) =>
    new Item(
      doc._id,
      doc.title,
      doc.description,
      doc.price,
      doc.brand,
      doc.category,
      doc.condition,
      doc.images,
      doc.visibility_status ? "visible" : "hidden",
      doc.created_at,
      doc.location
    )
  );
}

module.exports = {
  save,
  findById,
  findAll,
  filterByLocation,
  filterByCategory,
  filterByCondition,
  filterByPrice,
  sortItems,
};
