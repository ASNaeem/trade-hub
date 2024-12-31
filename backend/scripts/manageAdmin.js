#!/usr/bin/env node

const mongoose = require("mongoose");
const { createAdmin } = require("./setupAdmin");
const AdminModel = require("../models/adminSchema");
require("dotenv").config();

// Use main database URI instead of test database
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/tradehub";

// Command-line argument parsing
const args = process.argv.slice(2);
const command = args[0];

// Available commands
const COMMANDS = {
  LIST: "list",
  CREATE: "create",
  UPDATE_ROLE: "update-role",
  DELETE: "delete",
};

// Valid roles
const VALID_ROLES = ["admin", "superadmin"];

// Usage instructions
function printUsage() {
  console.log("\nUsage:");
  console.log("  node manageAdmin.js list");
  console.log("  node manageAdmin.js create <name> <email> <password> <role>");
  console.log("  node manageAdmin.js update-role <email> <newRole>");
  console.log("  node manageAdmin.js delete <email>");
  console.log("\nExamples:");
  console.log(
    '  node manageAdmin.js create "John Doe" john@example.com password123 admin'
  );
  console.log("  node manageAdmin.js update-role john@example.com superadmin");
  console.log("  node manageAdmin.js delete john@example.com");
  process.exit(1);
}

// List all admins
async function listAdmins() {
  try {
    const admins = await AdminModel.find({}, "-password");
    if (admins.length === 0) {
      console.log("No admin accounts found");
      return;
    }

    console.log("\nAdmin Accounts:");
    admins.forEach((admin) => {
      console.log(`\nName: ${admin.name}`);
      console.log(`Email: ${admin.email}`);
      console.log(`Role: ${admin.role}`);
      console.log(`Created: ${admin.createdAt}`);
    });
  } catch (error) {
    console.error("Error listing admins:", error.message);
    throw error;
  }
}

// Update admin role
async function updateAdminRole(email, newRole) {
  try {
    if (!VALID_ROLES.includes(newRole)) {
      throw new Error(
        `Invalid role. Must be one of: ${VALID_ROLES.join(", ")}`
      );
    }

    const admin = await AdminModel.findOne({ email: email.toLowerCase() });
    if (!admin) {
      throw new Error(`Admin with email ${email} not found`);
    }

    admin.role = newRole;
    await admin.save();
    console.log(`Updated role for ${email} to ${newRole}`);
  } catch (error) {
    console.error("Error updating admin role:", error.message);
    throw error;
  }
}

// Delete admin
async function deleteAdmin(email) {
  try {
    const result = await AdminModel.deleteOne({ email: email.toLowerCase() });
    if (result.deletedCount === 0) {
      throw new Error(`Admin with email ${email} not found`);
    }
    console.log(`Deleted admin account: ${email}`);
  } catch (error) {
    console.error("Error deleting admin:", error.message);
    throw error;
  }
}

// Main function
async function main() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB:", MONGODB_URI);

    // Process commands
    switch (command) {
      case COMMANDS.LIST:
        await listAdmins();
        break;

      case COMMANDS.CREATE:
        if (args.length !== 5) {
          console.error(
            "Error: create command requires name, email, password, and role"
          );
          printUsage();
        }
        const [_, name, email, password, role] = args;
        await createAdmin({ name, email, password, role });
        break;

      case COMMANDS.UPDATE_ROLE:
        if (args.length !== 3) {
          console.error(
            "Error: update-role command requires email and new role"
          );
          printUsage();
        }
        await updateAdminRole(args[1], args[2]);
        break;

      case COMMANDS.DELETE:
        if (args.length !== 2) {
          console.error("Error: delete command requires email");
          printUsage();
        }
        await deleteAdmin(args[1]);
        break;

      default:
        console.error("Error: Invalid command");
        printUsage();
    }
  } catch (error) {
    console.error("\nOperation failed:", error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
  }
}

// Run the script
if (require.main === module) {
  if (!command) {
    console.error("Error: No command provided");
    printUsage();
  }
  main().catch(console.error);
}
