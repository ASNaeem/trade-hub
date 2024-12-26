const Person = require("./Person");

class Admin extends Person {
  constructor(id, name, email, password, createdAt = new Date()) {
    super(id, name, email, password, createdAt); // Call parent constructor
    this._role = "admin"; // Default role
  }

  // Getter and Setter for Role
  get role() {
    return this._role;
  }

  set role(newRole) {
    const allowedRoles = ["admin", "superadmin"];
    if (!allowedRoles.includes(newRole.toLowerCase())) {
      throw new Error(`Role must be one of: ${allowedRoles.join(", ")}`);
    }
    this._role = newRole.toLowerCase();
  }

  // Override getSummary to include admin-specific fields
  getSummary() {
    return {
      ...super.getSummary(), // Get base fields from Person
      role: this._role,
    };
  }

  // Admin-specific method to check if they have super admin privileges
  isSuperAdmin() {
    return this._role === "superadmin";
  }

  // Admin-specific method to manage users
  async manageUser(userId, action) {
    try {
      switch (action) {
        case "suspend":
          // Implementation for suspending user
          break;
        case "activate":
          // Implementation for activating user
          break;
        case "delete":
          // Implementation for deleting user
          break;
        default:
          throw new Error(`Invalid action: ${action}`);
      }
    } catch (error) {
      throw new Error(`Error managing user: ${error.message}`);
    }
  }

  // Admin-specific method to manage policies
  async managePolicy(policyId, updates) {
    try {
      // Logic for updating global policies
      return true;
    } catch (error) {
      throw new Error(`Error managing policy: ${error.message}`);
    }
  }

  // Admin-specific method to handle disputes
  async handleDispute(disputeId, action, note) {
    const validActions = [
      "warning",
      "delete_content",
      "temporary_ban",
      "permanent_ban",
      "no_action",
    ];

    if (!validActions.includes(action)) {
      throw new Error(
        `Invalid action. Must be one of: ${validActions.join(", ")}`
      );
    }

    try {
      // Implementation will be in disputeService
      return {
        action,
        adminId: this.id,
        note,
        createdAt: new Date(),
      };
    } catch (error) {
      throw new Error(`Error handling dispute: ${error.message}`);
    }
  }

  // Add note to dispute
  async addDisputeNote(disputeId, note) {
    try {
      return {
        note,
        adminId: this.id,
        createdAt: new Date(),
      };
    } catch (error) {
      throw new Error(`Error adding note to dispute: ${error.message}`);
    }
  }
}

module.exports = Admin;
