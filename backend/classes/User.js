const Person = require("./Person");

class User extends Person {
  constructor(id, name, email, phone, password, createdAt = new Date()) {
    super(id, name, email, password, createdAt); // Calling the parent constructor
    this._phone = phone; // User-specific field
    this._itemsListed = []; // User-specific field for tracking listed items
  }

  // Getter and Setter for Phone
  get phone() {
    return this._phone;
  }

  set phone(newPhone) {
    if (!/^\+?\d{10,14}$/.test(newPhone)) {
      throw new Error("Invalid phone number. Must be 10-14 digits and can optionally start with '+'.");
    }
    this._phone = newPhone;
  }

  // Getter for Items Listed
  get itemsListed() {
    return this._itemsListed;
  }

  // Add Item to Listed Items
  addItem(itemId) {
    this._itemsListed.push(itemId);
  }

  // Remove Item from Listed Items
  removeItem(itemId) {
    this._itemsListed = this._itemsListed.filter((id) => id !== itemId);
  }
  getSummary() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      createdAt: this.createdAt,
    };
  }
}
module.exports = User;
