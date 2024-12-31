const AdminClass = require("../classes/Admin");
const AdminModel = require("../models/adminSchema");
const UserModel = require("../models/userSchema");
const ItemModel = require("../models/itemSchema");
const DisputeModel = require("../models/disputeSchema");
const GlobalPolicySetting = require("../models/globalPolicySettingSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/test.config");
const UserClass = require("../classes/User");

const AdminService = {
  async createAdmin(name, email, password, role = "admin") {
    try {
      const existingAdmin = await AdminModel.findOne({
        email: email.toLowerCase(),
      });
      if (existingAdmin) {
        throw new Error("Email already registered");
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const admin = new AdminModel({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role,
      });

      const savedAdmin = await admin.save();
      return new AdminClass(
        savedAdmin._id,
        savedAdmin.name,
        savedAdmin.email,
        savedAdmin.password
      );
    } catch (error) {
      throw error;
    }
  },

  async authenticateAdmin(email, password) {
    try {
      const admin = await AdminModel.findOne({ email: email.toLowerCase() });
      if (!admin) {
        throw new Error("Invalid credentials");
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        throw new Error("Invalid credentials");
      }

      const token = jwt.sign(
        { id: admin._id, email: admin.email, role: admin.role },
        config.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return {
        admin: new AdminClass(
          admin._id,
          admin.name,
          admin.email,
          admin.password
        ),
        token,
        role: admin.role,
      };
    } catch (error) {
      throw error;
    }
  },

  async getAdminById(adminId) {
    try {
      const admin = await AdminModel.findById(adminId);
      if (!admin) return null;
      return new AdminClass(admin._id, admin.name, admin.email, admin.password);
    } catch (error) {
      throw error;
    }
  },

  async updateAdmin(adminId, updates) {
    try {
      if (updates.password) {
        const salt = await bcrypt.genSalt(10);
        updates.password = await bcrypt.hash(updates.password, salt);
      }

      const admin = await AdminModel.findByIdAndUpdate(adminId, updates, {
        new: true,
      });
      if (!admin) return null;
      return new AdminClass(admin._id, admin.name, admin.email, admin.password);
    } catch (error) {
      throw error;
    }
  },

  async getAllUsers() {
    try {
      const users = await UserModel.find();
      const usersWithListings = await Promise.all(
        users.map(async (user) => {
          const listings = await ItemModel.find({ sellerId: user._id })
            .select("_id title price condition location")
            .lean();

          const userInstance = new UserClass(
            user._id,
            user.name,
            user.email,
            user.phone,
            user.password,
            user.createdAt,
            user.profilePicture,
            user.govtDocument,
            user.isDocumentVerified,
            user.city,
            user.isEmailVerified,
            user.favourites,
            user.isBanned,
            user.isUnderReview
          );

          return {
            ...userInstance.getSummary(),
            listings: listings.map((listing) => ({
              id: listing._id,
              title: listing.title,
              price: listing.price,
              condition: listing.condition,
              location: listing.location,
            })),
          };
        })
      );
      return usersWithListings;
    } catch (error) {
      throw error;
    }
  },

  async updateUserStatus(userId, status) {
    try {
      const updates = {
        isBanned: status === "ban",
        isUnderReview: status === "suspend",
        ...(status === "activate" && {
          isBanned: false,
          isUnderReview: false,
        }),
      };

      const userDocument = await UserModel.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true }
      );

      if (!userDocument) throw new Error("User not found");

      const userInstance = new UserClass(
        userDocument._id,
        userDocument.name,
        userDocument.email,
        userDocument.phone,
        userDocument.password,
        userDocument.createdAt,
        userDocument.profilePicture,
        userDocument.govtDocument,
        userDocument.isDocumentVerified,
        userDocument.city,
        userDocument.isEmailVerified,
        userDocument.favourites,
        userDocument.isBanned,
        userDocument.isUnderReview
      );

      return userInstance.getSummary();
    } catch (error) {
      throw error;
    }
  },

  async deleteUserListing(userId, listingId) {
    try {
      const listing = await ItemModel.findOneAndDelete({
        _id: listingId,
        sellerId: userId,
      });
      if (!listing) throw new Error("Listing not found");
      return { message: "Listing deleted successfully" };
    } catch (error) {
      throw error;
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
