const Person = require("./Person");

class Admin extends Person {
  constructor(id, name, email, role = "admin", createdAt = new Date()) {
    super(id, name, email, createdAt);
    this._role = role;
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
}

module.exports = Admin;
