const ItemModel = require("../models/itemSchema");
const ItemClass = require("../classes/Item");

async function createItem (title, description, price, brand, category, condition, images, location, sellerId){
  const item = new ItemClass(
    null,
    title,
    description,
    price,
    brand,
    category,
    condition,
    images,
    "visible",
    new Date(),
    location,
    sellerId
  );

  const itemDocument = new ItemModel({
    title: item.title,
    description: item.description,
    price: item.price,
    brand: item.brand,
    category: item.category,
    condition: item.condition,
    images: item.images,
    visibility_status: item.visibilityStatus === "visible",
    created_at: item.createdAt,
    location: item.location,
    sellerId: item.sellerId, // Ensure ownership
  });

  const savedItem = await itemDocument.save();
  return new ItemClass(
    itemDoc._id,
    itemDoc.title,
    itemDoc.description,
    itemDoc.price,
    itemDoc.brand,
    itemDoc.category,
    itemDoc.condition,
    itemDoc.images,
    itemDoc.visibility_status ? "visible" : "hidden",
    itemDoc.created_at,
    itemDoc.location,
    itemDoc.sellerId
  );
}

async function getAllItems (filters){
  const items = await ItemModel.find(filters);
  return items.map(toItemClass);
};

async function getItemById (itemId){
  const item = await ItemModel.findById(itemId);
  return item ? new ItemClass(
    itemDoc._id,
    itemDoc.title,
    itemDoc.description,
    itemDoc.price,
    itemDoc.brand,
    itemDoc.category,
    itemDoc.condition,
    itemDoc.images,
    itemDoc.visibility_status ? "visible" : "hidden",
    itemDoc.created_at,
    itemDoc.location,
    itemDoc.sellerId
  ) : null;
};

async function updateItem (itemId, updates, userId){
  const item = await ItemModel.findById(itemId);
  if (!item || item.seller.toString() !== userId) return null;

  Object.assign(item, updates); // Apply updates
  const updatedItem = await item.save();
  return new ItemClass(
    itemDoc._id,
    itemDoc.title,
    itemDoc.description,
    itemDoc.price,
    itemDoc.brand,
    itemDoc.category,
    itemDoc.condition,
    itemDoc.images,
    itemDoc.visibility_status ? "visible" : "hidden",
    itemDoc.created_at,
    itemDoc.location,
    itemDoc.sellerId
  );
};

async function deleteItem (itemId, userId){
  const item = await ItemModel.findById(itemId);
  if (!item || item.seller.toString() !== userId) return false;

  await item.deleteOne();
  return true;
};

module.exports = {
  createItem,
  getAllItems,
  getItemById,
  updateItem, 
  deleteItem
};