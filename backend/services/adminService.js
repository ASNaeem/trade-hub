const AdminClass = require("../classes/Admin");
const AdminModel = require("../models/adminSchema");
const UserModel = require("../models/userSchema");
const ItemModel = require("../models/itemSchema");
const DisputeModel = require("../models/disputeSchema");
const GlobalPolicySetting = require("../models/globalPolicySettingSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/test.config");

const AdminService = {
  async createAdmin(name, email, password, role = "admin") {
    const adminClassInstance = new AdminClass(
      null,
      name,
      email,
      password,
      new Date()
    );
    adminClassInstance.role = role;

    const salt = await bcrypt.genSalt(10);
    adminClassInstance.password = await bcrypt.hash(password, salt);

    const adminDocument = new AdminModel({
      name: adminClassInstance.name,
      email: adminClassInstance.email,
      password: adminClassInstance.password,
      role: adminClassInstance.role,
      createdAt: adminClassInstance.createdAt,
    });

    const savedAdmin = await adminDocument.save();
    return new AdminClass(
      savedAdmin._id,
      savedAdmin.name,
      savedAdmin.email,
      savedAdmin.password,
      savedAdmin.createdAt
    );
  },

  async authenticateAdmin(email, password) {
    try {
      console.log("Attempting to authenticate admin:", email);
      const adminDocument = await AdminModel.findOne({
        email: email.toLowerCase(),
      });

      if (!adminDocument) {
        console.log("Admin not found with email:", email);
        throw new Error("Invalid credentials");
      }

      console.log("Admin found, verifying password...");
      const isMatch = await bcrypt.compare(password, adminDocument.password);

      if (!isMatch) {
        console.log("Password verification failed");
        throw new Error("Invalid credentials");
      }

      console.log("Password verified, generating token...");
      const adminClassInstance = new AdminClass(
        adminDocument._id,
        adminDocument.name,
        adminDocument.email,
        adminDocument.password,
        adminDocument.createdAt
      );

      const payload = {
        id: adminDocument._id,
        email: adminDocument.email,
        role: adminDocument.role,
      };

      const token = jwt.sign(payload, config.JWT_SECRET, {
        expiresIn: "1h",
      });

      console.log("Authentication successful for admin:", email);
      return {
        admin: adminClassInstance,
        token,
        role: adminDocument.role,
      };
    } catch (error) {
      console.error("Authentication error:", error.message);
      throw error;
    }
  },

  async getAdminById(adminId) {
    try {
      const admin = await AdminModel.findById(adminId);
      if (!admin) return null;

      const adminInstance = new AdminClass(
        admin._id,
        admin.name,
        admin.email,
        admin.password,
        admin.createdAt
      );
      adminInstance.role = admin.role;

      return adminInstance;
    } catch (error) {
      console.error("Error getting admin by ID:", error.message);
      throw error;
    }
  },

  async updateAdmin(adminId, updates) {
    const admin = await AdminModel.findById(adminId);
    if (!admin) return null;

    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const updatedAdmin = await AdminModel.findByIdAndUpdate(
      adminId,
      { $set: updates },
      { new: true }
    );

    return new AdminClass(
      updatedAdmin._id,
      updatedAdmin.name,
      updatedAdmin.email,
      updatedAdmin.password,
      updatedAdmin.createdAt
    );
  },

  async getAllUsers() {
    try {
      const users = await UserModel.find().select("-password");
      return users.map((user) => ({
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        status: user.isBanned
          ? "banned"
          : user.isUnderReview
          ? "suspended"
          : "active",
        listings: user.listings || [],
        profilePicture: user.profilePicture,
        isDocumentVerified: user.isDocumentVerified,
        createdAt: user.createdAt,
      }));
    } catch (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  },

  async updateUserStatus(userId, status) {
    try {
      const updates = {
        isBanned: status === "ban",
        isUnderReview: status === "suspended",
      };

      const user = await UserModel.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true }
      ).select("-password");

      if (!user) {
        throw new Error("User not found");
      }

      return {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.isBanned
          ? "banned"
          : user.isUnderReview
          ? "suspended"
          : "active",
      };
    } catch (error) {
      throw new Error(`Error updating user status: ${error.message}`);
    }
  },

  async deleteUserListing(userId, listingId) {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      const listing = await ItemModel.findById(listingId);
      if (!listing) {
        throw new Error("Listing not found");
      }

      if (listing.sellerId.toString() !== userId) {
        throw new Error("Listing does not belong to user");
      }

      await ItemModel.findByIdAndDelete(listingId);
      return true;
    } catch (error) {
      throw new Error(`Error deleting listing: ${error.message}`);
    }
  },

  async getAllDisputes() {
    try {
      const disputes = await DisputeModel.find()
        .populate("reportedBy", "name email")
        .populate("reportedItem", "title");

      return disputes.map((dispute) => ({
        id: dispute._id,
        reportedBy: dispute.reportedBy.name,
        reporterEmail: dispute.reportedBy.email,
        status: dispute.status,
        description: dispute.description,
        resolution: dispute.resolution,
        createdAt: dispute.createdAt,
        itemTitle: dispute.reportedItem?.title || "Deleted Item",
      }));
    } catch (error) {
      throw new Error(`Error fetching disputes: ${error.message}`);
    }
  },

  async resolveDispute(disputeId, resolution) {
    try {
      const dispute = await DisputeModel.findByIdAndUpdate(
        disputeId,
        {
          $set: {
            status: "resolved",
            resolution,
            resolvedAt: new Date(),
          },
        },
        { new: true }
      );

      if (!dispute) {
        throw new Error("Dispute not found");
      }

      return dispute;
    } catch (error) {
      throw new Error(`Error resolving dispute: ${error.message}`);
    }
  },

  async getAllPolicies() {
    try {
      const policies = await GlobalPolicySetting.find();
      return policies.map((policy) => ({
        id: policy._id,
        name: policy.name,
        value: policy.value,
        description: policy.description,
        updatedAt: policy.updatedAt || policy.createdAt,
      }));
    } catch (error) {
      throw new Error(`Error fetching policies: ${error.message}`);
    }
  },

  async updatePolicy(policyId, value) {
    try {
      const policy = await GlobalPolicySetting.findByIdAndUpdate(
        policyId,
        {
          $set: {
            value,
            updatedAt: new Date(),
          },
        },
        { new: true }
      );

      if (!policy) {
        throw new Error("Policy not found");
      }

      return {
        id: policy._id,
        name: policy.name,
        value: policy.value,
        description: policy.description,
        updatedAt: policy.updatedAt,
      };
    } catch (error) {
      throw new Error(`Error updating policy: ${error.message}`);
    }
  },
};

module.exports = AdminService;
