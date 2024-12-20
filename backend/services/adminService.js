const AdminClass = require("../classes/Admin");
const AdminModel = require("../models/adminSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
    const adminDocument = await AdminModel.findOne({ email });
    if (!adminDocument) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, adminDocument.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const adminClassInstance = new AdminClass(
      adminDocument._id,
      adminDocument.name,
      adminDocument.email,
      adminDocument.password,
      adminDocument.createdAt
    );

    const payload = {
      id: adminClassInstance.id,
      email: adminClassInstance.email,
      role: adminDocument.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return { admin: adminClassInstance, token };
  },

  async getAdminById(adminId) {
    const admin = await AdminModel.findById(adminId);
    if (!admin) return null;

    return new AdminClass(
      admin._id,
      admin.name,
      admin.email,
      admin.password,
      admin.createdAt
    );
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
};

module.exports = AdminService;
