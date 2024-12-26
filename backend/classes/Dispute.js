class Dispute {
  constructor(
    id,
    type,
    targetId,
    targetType,
    reporterId,
    reportedId,
    reason,
    description,
    status = "pending",
    adminNotes = [],
    resolution = null,
    createdAt = new Date(),
    resolvedAt = null
  ) {
    this._id = id;
    this._type = type;
    this._targetId = targetId;
    this._targetType = targetType;
    this._reporterId = reporterId;
    this._reportedId = reportedId;
    this._reason = reason;
    this._description = description;
    this._status = status;
    this._adminNotes = adminNotes;
    this._resolution = resolution;
    this._createdAt = createdAt;
    this._resolvedAt = resolvedAt;
  }

  // Getters
  get type() {
    return this._type;
  }
  get targetId() {
    return this._targetId;
  }
  get targetType() {
    return this._targetType;
  }
  get reporterId() {
    return this._reporterId;
  }
  get reportedId() {
    return this._reportedId;
  }
  get reason() {
    return this._reason;
  }
  get description() {
    return this._description;
  }
  get status() {
    return this._status;
  }
  get adminNotes() {
    return this._adminNotes;
  }
  get resolution() {
    return this._resolution;
  }
  get createdAt() {
    return this._createdAt;
  }
  get resolvedAt() {
    return this._resolvedAt;
  }

  // Add admin note
  addAdminNote(adminId, note) {
    this._adminNotes.push({
      note,
      adminId,
      createdAt: new Date(),
    });
  }

  // Resolve dispute
  resolve(adminId, action, note) {
    this._status = "resolved";
    this._resolvedAt = new Date();
    this._resolution = {
      action,
      adminId,
      note,
      createdAt: new Date(),
    };
  }

  // Update status
  updateStatus(status) {
    const validStatuses = ["pending", "investigating", "resolved", "rejected"];
    if (!validStatuses.includes(status)) {
      throw new Error(
        `Invalid status. Must be one of: ${validStatuses.join(", ")}`
      );
    }
    this._status = status;
  }

  getSummary() {
    return {
      id: this._id,
      type: this._type,
      targetId: this._targetId,
      targetType: this._targetType,
      reporterId: this._reporterId,
      reportedId: this._reportedId,
      reason: this._reason,
      description: this._description,
      status: this._status,
      adminNotes: this._adminNotes,
      resolution: this._resolution,
      createdAt: this._createdAt,
      resolvedAt: this._resolvedAt,
    };
  }
}

module.exports = Dispute;
