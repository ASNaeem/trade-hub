class Person {
  constructor(id, name, email, password, createdAt = new Date()) {
    this._id = id;
    this._name = name;
    this._email = email;
    this._password = password; // Shared field
    this._createdAt = createdAt;
  }

  // Getter for ID
  get id() {
    return this._id;
  }

  // Getter and Setter for Name
  get name() {
    return this._name;
  }

  set name(newName) {
    this._name = newName;
  }

  // Getter and Setter for Email
  get email() {
    return this._email;
  }

  set email(newEmail) {
    this._email = newEmail;
  }

  // Getter and Setter for Password (restricted access)
  get password() {
    return "Password access is restricted."; // Avoid direct password access
  }

  set password(newPassword) {
    if (newPassword.length < 8) {
      throw new Error("Password must be at least 8 characters long.");
    }
    this._password = newPassword;
  }

  // Getter for Created Date
  get createdAt() {
    return this._createdAt;
  }

  // Method to return a safe summary of the Person (for logging, etc.)
  getSummary() {
    return {
      id: this._id,
      name: this._name,
      email: this._email,
      createdAt: this._createdAt,
    };
  }
}

module.exports = Person;
