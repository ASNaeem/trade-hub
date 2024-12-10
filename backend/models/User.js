const Person = require("./Person");

class User extends Person {
  constructor(id, name, email, password, createdAt = new Date()) {
    super(id, name, email, createdAt);
    this._password = password; // Private
    this._itemsListed = []; // Array of item IDs
  }

  // Getter for Items Listed
  get itemsListed() {
    return this._itemsListed;
  }

  // Add Item
  addItem(itemId) {
    this._itemsListed.push(itemId);
  }

  // Remove Item
  removeItem(itemId) {
    this._itemsListed = this._itemsListed.filter((id) => id !== itemId);
  }

  // Getter for Password (Avoid unless necessary)
  get password() {
    return "Password access is restricted.";
  }

  // Setter for Password
  set password(newPassword) {
    if (newPassword.length < 8) {
      throw new Error("Password must be at least 8 characters long.");
    }
    this._password = newPassword;
  }
}

module.exports = User;
