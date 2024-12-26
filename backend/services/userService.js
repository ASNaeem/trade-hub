const UserClass = require("../classes/User");
const UserModel = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/test.config");

const UserService = {
  async createUnverifiedUser(name, email, phone, password) {
    try {
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      const existingPhone = await UserModel.findOne({ phone });
      if (existingPhone) {
        throw new Error("Phone number already registered");
      }

      const existingEmail = await UserModel.findOne({
        email: email.toLowerCase(),
      });
      if (existingEmail) {
        throw new Error("Email already registered");
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const user = new UserModel({
        name,
        email: email.toLowerCase(),
        phone,
        password: hashedPassword,
      });

      await user.save();

      // Create JWT
      const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
        expiresIn: "24h",
      });

      return {
        user,
        token,
      };
    } catch (error) {
      throw error;
    }
  },

  async createUser(name, email, phone, password) {
    try {
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      const existingPhone = await UserModel.findOne({ phone });
      if (existingPhone) {
        throw new Error("Phone number already registered");
      }

      const existingEmail = await UserModel.findOne({
        email: email.toLowerCase(),
      });
      if (existingEmail) {
        throw new Error("Email already registered");
      }

      const userClassInstance = new UserClass(
        null,
        name,
        email,
        phone,
        password
      );

      const salt = await bcrypt.genSalt(10);
      userClassInstance.password = await bcrypt.hash(password, salt);

      const userDocument = new UserModel({
        name: userClassInstance.name,
        email: userClassInstance.email.toLowerCase(),
        phone: userClassInstance.phone,
        password: userClassInstance.password,
      });

      const savedUser = await userDocument.save();
      const token = jwt.sign(
        { id: savedUser._id, email: savedUser.email },
        config.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return {
        user: new UserClass(
          savedUser._id,
          savedUser.name,
          savedUser.email,
          savedUser.phone,
          savedUser.password,
          savedUser.createdAt
        ),
        token,
      };
    } catch (error) {
      if (
        error.message.includes("already registered") ||
        error.message.includes("must be at least 8 characters")
      ) {
        throw error;
      }
      if (error.code === 11000) {
        if (error.keyPattern?.phone) {
          throw new Error("Phone number already registered");
        }
        if (error.keyPattern?.email) {
          throw new Error("Email already registered");
        }
      }
      throw error;
    }
  },

  async authenticateUser(email, password) {
    const userDocument = await UserModel.findOne({ email });
    if (!userDocument) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, userDocument.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      { id: userDocument._id, email: userDocument.email },
      config.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return {
      user: new UserClass(
        userDocument._id,
        userDocument.name,
        userDocument.email,
        userDocument.phone,
        userDocument.password,
        userDocument.createdAt
      ),
      token,
    };
  },

  async findUserById(userId) {
    try {
      const userDocument = await UserModel.findById(userId);
      if (!userDocument) return null;

      return new UserClass(
        userDocument._id,
        userDocument.name,
        userDocument.email,
        userDocument.phone,
        userDocument.password,
        userDocument.createdAt
      );
    } catch (error) {
      throw new Error(`Error finding user: ${error.message}`);
    }
  },
  async findUserByEmail(email) {
    const userDocument = await UserModel.findOne({
      email: email.toLowerCase(),
    });
    if (!userDocument) return null;
    return new UserClass(
      userDocument._id,
      userDocument.name,
      userDocument.email,
      userDocument.phone,
      userDocument.password,
      userDocument.createdAt
    );
  },
  async updateUser(userId, updates) {
    try {
      console.log("Updating user:", userId, updates);
      const userDocument = await UserModel.findById(userId);

      if (!userDocument) {
        console.log("User not found:", userId);
        return null;
      }

      if (updates.profilePicture?.data) {
        updates.profilePicture.data = Buffer.from(
          updates.profilePicture.data,
          "base64"
        );
      }

      if (updates.govtDocument?.documentImage?.data) {
        updates.govtDocument.documentImage.data = Buffer.from(
          updates.govtDocument.documentImage.data,
          "base64"
        );
      }

      const updatedDocument = await UserModel.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true }
      );

      return new UserClass(
        updatedDocument._id,
        updatedDocument.name,
        updatedDocument.email,
        updatedDocument.phone,
        updatedDocument.password,
        updatedDocument.createdAt,
        updatedDocument.profilePicture,
        updatedDocument.govtDocument,
        updatedDocument.isDocumentVerified,
        updatedDocument.city
      );
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error(`Error updating user: ${error.message}`);
    }
  },

  async isDuplicate(email, phone) {
    const emailExists = await UserModel.findOne({ email });
    const phoneExists = await UserModel.findOne({ phone });

    return {
      email: !!emailExists,
      phone: !!phoneExists,
    };
  },

  async deleteUser(userId) {
    const result = await UserModel.findByIdAndDelete(userId);
    return !!result;
  },

  async findUserByPhone(phone) {
    return await UserModel.findOne({ phone });
  },
};

module.exports = UserService;
