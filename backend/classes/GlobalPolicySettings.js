class GlobalPolicySettings {
  constructor(id, policyName, value, updatedAt = new Date()) {
    this._id = id;
    this._policyName = policyName;
    this._value = value;
    this._updatedAt = updatedAt;
  }

  // Getter for Policy Name
  get policyName() {
    return this._policyName;
  }

  // Setter for Policy Name
  set policyName(newName) {
    if (!newName || newName.length < 3) {
      throw new Error('Policy name must be at least 3 characters long.');
    }
    this._policyName = newName;
  }

  // Getter for Value
  get value() {
    return this._value;
  }

  // Setter for Value
  set value(newValue) {
    if (typeof newValue !== 'number' || newValue < 0) {
      throw new Error('Policy value must be a positive number.');
    }
    this._value = newValue;
    this._updatedAt = new Date();
  }

  // Getter for Updated At
  get updatedAt() {
    return this._updatedAt;
  }
}

module.exports = GlobalPolicySettings;
