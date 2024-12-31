const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const AdminModel = require("../models/adminSchema");
const GlobalPolicySetting = require("../models/globalPolicySettingSchema");
require("dotenv").config();

// Use main database URI instead of test database
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/tradehub";

// Default admin credentials
const DEFAULT_ADMIN = {
  name: "Super Admin",
  email: "admin@tradehub.com",
  password: "Admin@123",
  role: "superadmin",
};

// Default policy settings
const DEFAULT_POLICIES = [
  {
    name: "minItemPrice",
    value: 1,
    description: "Minimum price for any item",
  },
  {
    name: "maxItemPrice",
    value: 10000,
    description: "Maximum price for any item",
  },
  {
    name: "maxPriceUnverified",
    value: 1000,
    description: "Maximum price for items listed by unverified users",
  },
  {
    name: "maxActiveListings",
    value: 10,
    description: "Maximum number of active listings per user",
  },
];

async function checkConnection() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB:", MONGODB_URI);
    return true;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    return false;
  }
}

async function dropCollections() {
  try {
    // Drop both collections if they exist
    if (mongoose.connection.collections["admins"]) {
      await mongoose.connection.collections["admins"].drop();
      console.log("Dropped admins collection");
    }
    if (mongoose.connection.collections["globalpolicysettings"]) {
      await mongoose.connection.collections["globalpolicysettings"].drop();
      console.log("Dropped policies collection");
    }
  } catch (error) {
    console.error("Error dropping collections:", error);
    throw error;
  }
}

async function createAdmin(adminData) {
  try {
    // Validate admin data
    if (!adminData.email || !adminData.password || !adminData.name) {
      throw new Error("Admin email, password, and name are required");
    }

    if (adminData.password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    // Check if admin already exists
    const existingAdmin = await AdminModel.findOne({
      email: adminData.email.toLowerCase(),
    });

    if (existingAdmin) {
      console.log(`Admin with email ${adminData.email} already exists`);
      return existingAdmin;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);

    // Create new admin
    const admin = new AdminModel({
      name: adminData.name,
      email: adminData.email.toLowerCase(),
      password: hashedPassword,
      role: adminData.role || "admin",
      createdAt: new Date(),
    });

    await admin.save();
    console.log(
      `Created admin account for ${admin.email} with role ${admin.role}`
    );
    return admin;
  } catch (error) {
    console.error("Error creating admin:", error.message);
    throw error;
  }
}

async function setupPolicies() {
  try {
    // Get the superadmin ID
    const superAdmin = await AdminModel.findOne({ role: "superadmin" });
    if (!superAdmin) {
      throw new Error(
        "Super admin not found. Please create super admin first."
      );
    }

    console.log("Setting up policies with superadmin:", superAdmin.email);

    // Create new policies
    for (const policy of DEFAULT_POLICIES) {
      try {
        await GlobalPolicySetting.create({
          ...policy,
          createdBy: superAdmin._id,
          createdAt: new Date(),
        });
        console.log(`Created policy: ${policy.name} (value: ${policy.value})`);
      } catch (error) {
        console.error(`Error creating policy ${policy.name}:`, error.message);
        throw error;
      }
    }

    console.log("All policies created successfully");
  } catch (error) {
    console.error("Error setting up policies:", error.message);
    throw error;
  }
}

async function main() {
  try {
    // Check MongoDB connection
    const isConnected = await checkConnection();
    if (!isConnected) {
      throw new Error("Failed to connect to MongoDB");
    }

    // Drop existing collections
    await dropCollections();

    // Create default super admin
    const superAdmin = await createAdmin(DEFAULT_ADMIN);
    if (!superAdmin) {
      throw new Error("Failed to create super admin");
    }

    // Set up default policies
    await setupPolicies();

    console.log("\nAdmin setup completed successfully");
    console.log("You can now log in with:");
    console.log(`Email: ${DEFAULT_ADMIN.email}`);
    console.log(`Password: ${DEFAULT_ADMIN.password}`);
  } catch (error) {
    console.error("\nError in admin setup:", error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
  }
}

// Run the script if called directly
if (require.main === module) {
  main().catch(console.error);
}

// Export functions for use in other scripts
module.exports = {
  createAdmin,
  setupPolicies,
  DEFAULT_ADMIN,
  DEFAULT_POLICIES,
};
