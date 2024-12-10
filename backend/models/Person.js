class Person {
  constructor(id, name, email, createdAt = new Date()) {
    this._id = id;
    this._name = name;
    this._email = email;
    this._createdAt = createdAt;
  }

  // Getter for Name
  get name() {
    return this._name;
  }

  // Setter for Name
  set name(newName) {
    if (!newName || newName.length < 2) {
      throw new Error("Name must be at least 2 characters long.");
    }
    this._name = newName;
  }

  // Getter for Email
  get email() {
    return this._email;
  }

  // Setter for Email
  set email(newEmail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      throw new Error("Invalid email format.");
    }
    this._email = newEmail;
  }

  // Getter for Created At
  get createdAt() {
    return this._createdAt;
  }

  // No setter for createdAt to prevent modification
}

module.exports = Person;
