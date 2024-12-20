const GlobalPolicySettingsClass = require("../classes/GlobalPolicySettings");
const GlobalPolicySettingsModel = require("../models/globalPolicySettingsSchema");

const GlobalPolicySettingsService = {
  async createPolicy(policyName, value, description, adminId) {
    const policyClassInstance = new GlobalPolicySettingsClass(
      null,
      policyName,
      value
    );

    const policyDocument = new GlobalPolicySettingsModel({
      policyName: policyClassInstance.policyName,
      value: policyClassInstance.value,
      description,
      updatedBy: adminId,
    });

    const savedPolicy = await policyDocument.save();
    return new GlobalPolicySettingsClass(
      savedPolicy._id,
      savedPolicy.policyName,
      savedPolicy.value,
      savedPolicy.updatedAt
    );
  },

  async updatePolicy(policyId, updates, adminId) {
    const policy = await GlobalPolicySettingsModel.findById(policyId);
    if (!policy) return null;

    if (updates.policyName) policy.policyName = updates.policyName;
    if (updates.value !== undefined) policy.value = updates.value;
    if (updates.description) policy.description = updates.description;

    policy.updatedAt = new Date();
    policy.updatedBy = adminId;

    const updatedPolicy = await policy.save();
    return new GlobalPolicySettingsClass(
      updatedPolicy._id,
      updatedPolicy.policyName,
      updatedPolicy.value,
      updatedPolicy.updatedAt
    );
  },

  async getPolicyByName(policyName) {
    const policy = await GlobalPolicySettingsModel.findOne({ policyName });
    if (!policy) return null;

    return new GlobalPolicySettingsClass(
      policy._id,
      policy.policyName,
      policy.value,
      policy.updatedAt
    );
  },

  async getAllPolicies() {
    const policies = await GlobalPolicySettingsModel.find().sort({
      policyName: 1,
    });
    return policies.map(
      (policy) =>
        new GlobalPolicySettingsClass(
          policy._id,
          policy.policyName,
          policy.value,
          policy.updatedAt
        )
    );
  },
};

module.exports = GlobalPolicySettingsService;
