const GlobalPolicySetting = require("../models/globalPolicySettingSchema");
const ItemModel = require("../models/itemSchema");

const GlobalPolicySettingsService = {
  async getAllPolicies() {
    try {
      return await GlobalPolicySetting.find();
    } catch (error) {
      throw new Error(`Error getting policies: ${error.message}`);
    }
  },

  async getPolicyByName(name) {
    try {
      const policy = await GlobalPolicySetting.findOne({ name });
      if (!policy) {
        throw new Error(`Policy '${name}' not found`);
      }
      return policy;
    } catch (error) {
      throw new Error(`Error getting policy: ${error.message}`);
    }
  },

  async updatePolicy(policyId, value) {
    try {
      const policy = await GlobalPolicySetting.findById(policyId);
      if (!policy) {
        throw new Error("Policy not found");
      }

      policy.value = value;
      await policy.save();
      return policy;
    } catch (error) {
      throw new Error(`Error updating policy: ${error.message}`);
    }
  },

  async enforceItemPolicies(userId, itemData, isVerified) {
    try {
      // Get all required policies
      const [
        minPricePolicy,
        maxPricePolicy,
        maxPriceUnverifiedPolicy,
        maxActiveListingsPolicy,
      ] = await Promise.all([
        this.getPolicyByName("minItemPrice"),
        this.getPolicyByName("maxItemPrice"),
        this.getPolicyByName("maxPriceUnverified"),
        this.getPolicyByName("maxActiveListings"),
      ]);

      // Check price against minimum and maximum limits
      if (itemData.price < minPricePolicy.value) {
        throw new Error(`Price cannot be less than ${minPricePolicy.value}`);
      }

      if (itemData.price > maxPricePolicy.value) {
        throw new Error(`Price cannot exceed ${maxPricePolicy.value}`);
      }

      // Check price limit for unverified users
      if (!isVerified && itemData.price > maxPriceUnverifiedPolicy.value) {
        throw new Error(
          `Unverified users cannot list items above ${maxPriceUnverifiedPolicy.value}. Please verify your account first.`
        );
      }

      // Check active listings limit (only for new items)
      if (!itemData._id) {
        const activeListingsCount = await ItemModel.countDocuments({
          sellerId: userId,
          status: { $ne: "deleted" },
        });

        if (activeListingsCount >= maxActiveListingsPolicy.value) {
          throw new Error(
            `You cannot have more than ${maxActiveListingsPolicy.value} active listings. Please remove some listings before creating new ones.`
          );
        }
      }

      return true;
    } catch (error) {
      throw new Error(`Policy violation: ${error.message}`);
    }
  },
};

module.exports = GlobalPolicySettingsService;
