
const axios = require("axios");
const User = require("./User"); // Admin will also manage users

class Admin extends User {
  constructor(id, name, email, password, createdAt = new Date(), phoneNumber) {
    super(id, name, email, password, createdAt, phoneNumber);
    this._role = "Admin"; // Admin role by default
  }
  // Getter for Role
  get role() {
    return this._role;
  }

  // Setter for Role
  set role(newRole) {
    const allowedRoles = ["admin", "superadmin"];
    if (!allowedRoles.includes(newRole)) {
      throw new Error(`Role must be one of: ${allowedRoles.join(", ")}`);
    }
    this._role = newRole;
  }

  // Manage Users (e.g., suspend, delete)
  async manageUser(userId) {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/users/${userId}/suspend`
      );
      console.log(`User ${userId} suspended:`, response.data);
    } catch (error) {
      console.error("Error managing user:", error.message);
    }
  }

  // Save Admin via API
  async save() {
    try {
      const response = await axios.post("http://localhost:5000/api/admin", {
        id: this._id,
        name: this._name,
        email: this._email,
        password: this._password,
        createdAt: this._createdAt,
        phoneNumber: this._phoneNumber,
      });
      console.log("Admin saved:", response.data);
    } catch (error) {
      console.error("Error saving admin:", error.message);
    }
  }

  // Load Admin via API
  static async load(email) {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/admin/${email}`);
      const { id, name, email: adminEmail, password, createdAt, phoneNumber } = response.data;
      return new Admin(id, name, adminEmail, password, new Date(createdAt), phoneNumber);
    } catch (error) {
      console.error("Error loading admin:", error.message);
      return null;
    }
  }
}

module.exports = Admin;
