const Person = require("./Person");

class User extends Person {
  constructor(
    id,
    name,
    email,
    phone,
    password,
    createdAt = new Date(),
    profilePicture = null,
    govtDocument = null,
    isDocumentVerified = false,
    city = null
  ) {
    super(id, name, email, password, createdAt);
    this._phone = phone;
    this._itemsListed = [];
    this._profilePicture = profilePicture;
    this._govtDocument = govtDocument;
    this._isDocumentVerified = isDocumentVerified;
    this._city = city;
  }

  // Getter and Setter for Phone
  get phone() {
    return this._phone;
  }

  set phone(newPhone) {
    if (!/^\+?\d{10,14}$/.test(newPhone)) {
      throw new Error(
        "Invalid phone number. Must be 10-14 digits and can optionally start with '+'."
      );
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

  get profilePicture() {
    return this._profilePicture;
  }

  set profilePicture(newProfilePicture) {
    this._profilePicture = newProfilePicture;
  }

  get govtDocument() {
    return this._govtDocument;
  }

  set govtDocument(newDocument) {
    this._govtDocument = newDocument;
  }

  get isDocumentVerified() {
    return this._isDocumentVerified;
  }

  get city() {
    return this._city;
  }

  set city(newCity) {
    this._city = newCity;
  }

  getSummary() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      profilePicture: this.profilePicture,
      govtDocument: this.govtDocument,
      isDocumentVerified: this.isDocumentVerified,
      city: this.city,
      createdAt: this.createdAt,
    };
  }
}

module.exports = User;
