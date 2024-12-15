const UserClass = require("../classes/User");
const UserModel = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function createUser(name, email, phone, password) {
  const newUserClass = new UserClass(null, name, email, phone, password);

  const salt = await bcrypt.genSalt(10);
  newUserClass.password = await bcrypt.hash(password, salt);

  const newUserDocument = new UserModel({
    name: newUserClass.name,
    email: newUserClass.email,
    phone: newUserClass.phone,
    password: newUserClass.password,
    createdAt: newUserClass.createdAt,
  });

  const savedUser = await newUserDocument.save();

  return new UserClass(
    savedUser._id,
    savedUser.name,
    savedUser.email,
    savedUser.phone,
    savedUser.password,
    savedUser.createdAt
  );
}

async function authenticateUser(email, password) {
  const userDocument = await UserModel.findOne({ email });
  if (!userDocument) {
    throw new Error("Invalid credentials");
  }
  
  console.log("Stored Password:", userDocument.password); 
  const isMatch = await bcrypt.compare(password, userDocument.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const userClassInstance = new UserClass(
    userDocument._id,
    userDocument.name,
    userDocument.email,
    userDocument.phone,
    userDocument.password,
    userDocument.createdAt
  );

  const payload = { id: userClassInstance.id, email: userClassInstance.email };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

  return { user: userClassInstance, token };
}

async function findUserById(userId) {
  const userDocument = await UserModel.findById(userId);
  if (!userDocument) return null;

  return new UserClass(
    userDocument._id,
    userDocument.name,
    userDocument.email,
    userDocument.phone,
    userDocument.password,
    userDocument.createdAt
  );
}

async function updateUser(userId, updates) {
  const userDocument = await UserModel.findById(userId);
  if (!userDocument) return null;

  const userClassInstance = new UserClass(
    userDocument._id,
    userDocument.name,
    userDocument.email,
    userDocument.phone,
    userDocument.password,
    userDocument.createdAt
  );

  if (updates.name) userClassInstance.name = updates.name;
  if (updates.phone) userClassInstance.phone = updates.phone;
  if (updates.password) {
    const salt = await bcrypt.genSalt(10);
    userClassInstance.password = await bcrypt.hash(updates.password, salt);
  }

  userDocument.name = userClassInstance.name;
  userDocument.phone = userClassInstance.phone;
  userDocument.password = userClassInstance.password;

  await userDocument.save();

  return userClassInstance;
}

async function isDuplicate(email, phone) {
  const emailExists = await UserModel.findOne({ email });
  const phoneExists = await UserModel.findOne({ phone });

  return {
    email: !!emailExists,
    phone: !!phoneExists,
  };
}

module.exports = {
  createUser,
  authenticateUser,
  findUserById,
  updateUser,
  isDuplicate,
};
