const GlobalPolicySetting = require("../models/globalPolicySettingSchema");
const Item = require("../models/itemSchema");
const User = require("../models/userSchema");
const Dispute = require("../models/disputeSchema");

const GlobalPolicySettingsService = {
  async createPolicy(name, value, description, adminId) {
    try {
      const policy = await GlobalPolicySetting.create({
        name,
        value,
        description,
        createdBy: adminId,
      });
      return policy;
    } catch (error) {
      throw new Error(`Error creating policy: ${error.message}`);
    }
  },

  async getAllPolicies() {
    try {
      return await GlobalPolicySetting.find().sort({ name: 1 });
    } catch (error) {
      throw new Error(`Error fetching policies: ${error.message}`);
    }
  },

  async getPolicyByName(name) {
    try {
      const policy = await GlobalPolicySetting.findOne({ name });
      return policy; // Return null if not found
    } catch (error) {
      throw new Error(`Error fetching policy: ${error.message}`);
    }
  },

  async updatePolicy(policyId, updates, adminId) {
    try {
      const policy = await GlobalPolicySetting.findById(policyId);
      if (!policy) {
        throw new Error("Policy not found");
      }

      // Add update metadata
      updates.updatedBy = adminId;
      updates.updatedAt = new Date();

      const updatedPolicy = await GlobalPolicySetting.findByIdAndUpdate(
        policyId,
        { $set: updates },
        { new: true }
      );

      return updatedPolicy;
    } catch (error) {
      throw new Error(`Error updating policy: ${error.message}`);
    }
  },

  async enforceItemPolicies(userId, item, isVerified) {
    try {
      // Check max items per user
      const maxItemsPolicy = await this.getPolicyByName("maxItemsPerUser");
      if (maxItemsPolicy) {
        const userItemCount = await Item.countDocuments({ sellerId: userId });
        if (userItemCount >= maxItemsPolicy.value) {
          throw new Error(
            `Policy violation: You can only have ${maxItemsPolicy.value} items listed at a time`
          );
        }
      }

      // Check price limits for unverified users
      if (!isVerified) {
        const maxPricePolicy = await this.getPolicyByName("maxPriceUnverified");
        if (maxPricePolicy && item.price > maxPricePolicy.value) {
          throw new Error(
            `Policy violation: Unverified users can only list items up to ${maxPricePolicy.value}`
          );
        }
      }

      // Check general price limits
      const minPricePolicy = await this.getPolicyByName("minItemPrice");
      const maxPricePolicy = await this.getPolicyByName("maxItemPrice");

      if (minPricePolicy && item.price < minPricePolicy.value) {
        throw new Error(
          `Policy violation: Item price cannot be less than ${minPricePolicy.value}`
        );
      }

      if (maxPricePolicy && item.price > maxPricePolicy.value) {
        throw new Error(
          `Policy violation: Item price cannot exceed ${maxPricePolicy.value}`
        );
      }

      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async enforceDisputePolicies(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      if (user.isBanned) {
        throw new Error("User is banned from the platform");
      }

      // Check if user has too many open disputes
      const maxDisputesPolicy = await this.getPolicyByName(
        "maxDisputesBeforeBan"
      );
      if (maxDisputesPolicy) {
        const openDisputes = await Dispute.countDocuments({
          reportedId: userId,
          status: "open",
        });

        if (openDisputes >= maxDisputesPolicy.value) {
          throw new Error("User has too many open disputes");
        }
      }

      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

module.exports = GlobalPolicySettingsService;
