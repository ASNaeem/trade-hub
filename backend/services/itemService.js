const ItemClass = require("../classes/Item");
const ItemModel = require("../models/itemSchema");

async function createItem(
  title,
  description,
  price,
  brand,
  category,
  condition,
  images,
  visibilityStatus,
  location,
  sellerId,
  createdAt = new Date()
) {
  // Create ItemClass instance
  const newItemClass = new ItemClass(
    null, // ID will be assigned by MongoDB
    title,
    description,
    price,
    brand,
    category,
    condition,
    images,
    visibilityStatus,
    createdAt,
    location,
    sellerId
  );

  // Create a new item document using Mongoose
  const newItemDocument = new ItemModel({
    title: newItemClass.title,
    description: newItemClass.description,
    price: newItemClass.price,
    brand: newItemClass.brand,
    category: newItemClass.category,
    condition: newItemClass.condition,
    images: newItemClass.images,
    visibilityStatus: newItemClass.visibilityStatus,
    createdAt: newItemClass.createdAt,
    location: newItemClass.location,
    sellerId: newItemClass.sellerId,
  });

  // Save the item document to the database
  const savedItem = await newItemDocument.save();

  // Return the created ItemClass instance
  return new ItemClass(
    savedItem._id,
    savedItem.title,
    savedItem.description,
    savedItem.price,
    savedItem.brand,
    savedItem.category,
    savedItem.condition,
    savedItem.images,
    savedItem.visibilityStatus,
    savedItem.createdAt,
    savedItem.location,
    savedItem.sellerId
  );
}

async function findItemById(itemId) {
  const itemDocument = await ItemModel.findById(itemId);
  if (!itemDocument) return null;

  // Return a new instance of ItemClass with the data from MongoDB
  return new ItemClass(
    itemDocument._id,
    itemDocument.title,
    itemDocument.description,
    itemDocument.price,
    itemDocument.brand,
    itemDocument.category,
    itemDocument.condition,
    itemDocument.images,
    itemDocument.visibilityStatus,
    itemDocument.createdAt,
    itemDocument.location,
    itemDocument.sellerId
  );
}

async function updateItem(itemId, updates) {
  const itemDocument = await ItemModel.findById(itemId);
  if (!itemDocument) return null;

  // Create ItemClass instance with current data
  const itemClassInstance = new ItemClass(
    itemDocument._id,
    itemDocument.title,
    itemDocument.description,
    itemDocument.price,
    itemDocument.brand,
    itemDocument.category,
    itemDocument.condition,
    itemDocument.images,
    itemDocument.visibilityStatus,
    itemDocument.createdAt,
    itemDocument.location,
    itemDocument.sellerId
  );

  // Update properties if they exist in the `updates` object
  if (updates.title) itemClassInstance.title = updates.title;
  if (updates.description) itemClassInstance.description = updates.description;
  if (updates.price) itemClassInstance.price = updates.price;
  if (updates.brand) itemClassInstance.brand = updates.brand;
  if (updates.category) itemClassInstance.category = updates.category;
  if (updates.condition) itemClassInstance.condition = updates.condition;
  if (updates.images) itemClassInstance.images = updates.images;
  if (updates.visibilityStatus)
    itemClassInstance.visibilityStatus = updates.visibilityStatus;
  if (updates.createdAt) itemClassInstance.createdAt = updates.createdAt;
  if (updates.location) itemClassInstance.location = updates.location;
  if (updates.sellerId) itemClassInstance.sellerId = updates.sellerId;

  // Apply updates to the Mongoose document
  itemDocument.title = itemClassInstance.title;
  itemDocument.description = itemClassInstance.description;
  itemDocument.price = itemClassInstance.price;
  itemDocument.brand = itemClassInstance.brand;
  itemDocument.category = itemClassInstance.category;
  itemDocument.condition = itemClassInstance.condition;
  itemDocument.images = itemClassInstance.images;
  itemDocument.visibilityStatus = itemClassInstance.visibilityStatus;
  itemDocument.createdAt = itemClassInstance.createdAt;
  itemDocument.location = itemClassInstance.location;
  itemDocument.sellerId = itemClassInstance.sellerId;

  // Save the updated document back to the database
  await itemDocument.save();

  // Return the updated ItemClass instance
  return itemClassInstance;
}

async function deleteItem(itemId) {
  const itemDocument = await ItemModel.findById(itemId);
  if (!itemDocument) return null;

  // Remove the item document from the database
  await itemDocument.remove();
  return { message: "Item successfully deleted" };
}

module.exports = {
  createItem,
  findItemById,
  updateItem,
  deleteItem,
};
