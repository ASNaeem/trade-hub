const UserClass = require("../classes/User");
const UserModel = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/test.config");
const tokenService = require("./tokenService");
const emailService = require("./emailService");

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
        isEmailVerified: false,
        favourites: [],
        profilePicture: null,
        govtDocument: null,
        isDocumentVerified: false,
        city: null,
        isBanned: false,
        isUnderReview: false,
      });

      await user.save();

      // Generate verification token
      const token = await tokenService.createToken(
        user._id,
        "verification",
        15
      );

      // Send OTP via email
      await emailService.sendOTP(email, token.tokenValue);

      return {
        token: token.tokenValue,
        email: user.email,
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

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const userDocument = new UserModel({
        name,
        email: email.toLowerCase(),
        phone,
        password: hashedPassword,
        isEmailVerified: false,
        favourites: [],
        profilePicture: null,
        govtDocument: null,
        isDocumentVerified: false,
        city: null,
        isBanned: false,
        isUnderReview: false,
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
          savedUser.createdAt,
          savedUser.profilePicture,
          savedUser.govtDocument,
          savedUser.isDocumentVerified,
          savedUser.city,
          savedUser.isEmailVerified,
          savedUser.favourites,
          savedUser.isBanned,
          savedUser.isUnderReview
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
    try {
      const user = await UserModel.findOne({ email: email.toLowerCase() });
      if (!user) {
        throw new Error("Invalid credentials");
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error("Invalid credentials");
      }

      // Check if user is banned or suspended
      if (user.isBanned) {
        throw new Error("BANNED");
      }

      if (user.isUnderReview) {
        throw new Error("SUSPENDED");
      }

      // Only check email verification if user exists and password matches
      if (!user.isEmailVerified) {
        // Generate new verification token and send it
        const token = await tokenService.createToken(
          user._id,
          "verification",
          15
        );
        await emailService.sendOTP(email, token.tokenValue);

        return {
          requireVerification: true,
          email: user.email,
          message: "Email not verified. Verification code sent.",
        };
      }

      const token = jwt.sign(
        { id: user._id, email: user.email },
        config.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return {
        user: new UserClass(
          user._id,
          user.name,
          user.email,
          user.phone,
          user.password,
          user.createdAt
        ),
        token,
      };
    } catch (error) {
      throw error;
    }
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
        updates.profilePicture.data = updates.profilePicture.data;
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
        updatedDocument.city,
        updatedDocument.isEmailVerified,
        updatedDocument.favourites,
        updatedDocument.isBanned,
        updatedDocument.isUnderReview
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

  async verifyUserEmail(email, tokenValue) {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new Error("User not found");
      }

      // Verify the token
      const verifiedToken = await tokenService.verifyToken(
        tokenValue,
        "verification"
      );
      if (
        !verifiedToken ||
        verifiedToken.userId.toString() !== user._id.toString()
      ) {
        return {
          success: false,
          message: "Invalid or expired verification code",
        };
      }

      user.isEmailVerified = true;
      await user.save();

      const authToken = jwt.sign(
        { id: user._id, email: user.email },
        config.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return {
        success: true,
        user: new UserClass(
          user._id,
          user.name,
          user.email,
          user.phone,
          user.password,
          user.createdAt,
          user.favorites
        ),
        token: authToken,
      };
    } catch (error) {
      if (error.message === "Invalid or expired verification code") {
        return { success: false, message: error.message };
      }
      throw error;
    }
  },

  async resendOTP(email) {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new Error("User not found");
      }

      // Delete any existing verification tokens for this user
      await tokenService.deleteAllUserTokens(user._id, "verification");

      // Generate new verification token
      const token = await tokenService.createToken(
        user._id,
        "verification",
        15
      );

      // Send new OTP via email
      const emailSent = await emailService.sendOTP(email, token.tokenValue);
      if (!emailSent) {
        throw new Error("Failed to send verification code");
      }

      return {
        success: true,
        message: "New verification code sent",
        email: user.email,
      };
    } catch (error) {
      throw error;
    }
  },

  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        throw new Error("Current password is incorrect");
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update password
      user.password = hashedPassword;
      await user.save();

      return true;
    } catch (error) {
      throw error;
    }
  },

  async addFavourite(userId, itemId) {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      user.favourites.push(itemId);
      await user.save();

      return true;
    } catch (error) {
      throw error;
    }
  },

  async deleteFavourite(userId, itemId) {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      const index = user.favourites.indexOf(itemId);
      if (index === -1) {
        throw new Error("Favorite not found");
      }

      user.favourites.splice(index, 1);
      await user.save();

      return true;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = UserService;
