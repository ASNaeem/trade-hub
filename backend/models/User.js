const axios = require("axios");
const Person = require("./Person");

class User extends Person {
  constructor(id, name, email, phone, password, createdAt = new Date()) {
    super(id, name, email, password, createdAt);
    this._phone = phone;
    this._itemsListed = []; // Array of item IDs
  }

  // Getter and Setter for Phone
  get phone() {
    return this._phone;
  }

  set phone(newPhone) {
    if (!/^\+?\d{10,15}$/.test(newPhone)) {
      throw new Error("Invalid phone number. Must be 10-15 digits and can optionally start with '+'.");
    }
    this._phone = newPhone;
  }

  // Getter for Items Listed
  get itemsListed() {
    return this._itemsListed;
  }

  // Add Item to Saved Items
  addItem(itemId) {
    this._itemsListed.push(itemId);
  }

  // Remove Item from Saved Items
  removeItem(itemId) {
    this._itemsListed = this._itemsListed.filter((id) => id !== itemId);
  }

  // Save User via API
  async save() {
    try {
      const response = await axios.post("http://localhost:5000/api/users", {
        id: this._id,
        name: this._name,
        email: this._email,
        phone: this._phone,
        password: this._password,
        createdAt: this._createdAt,
        itemsListed: this._itemsListed,
      });
      console.log("User saved:", response.data);
    } catch (error) {
      console.error("Error saving user:", error.message);
    }
  }

  // Load User via API
  static async load(email) {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${email}`);
      const { id, name, email: userEmail, phone, password, createdAt, itemsListed } = response.data;
      const user = new User(id, name, userEmail, phone, password, new Date(createdAt));
      user._itemsListed = itemsListed; // Populate the user's items
      return user;
    } catch (error) {
      console.error("Error loading user:", error.message);
    }
  }
}

module.exports = User;
