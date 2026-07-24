import mongoose from "mongoose";

/**
 * ------------------------------------------------------------------
 * User Schema
 * ------------------------------------------------------------------
 *
 * Represents a registered user in the application.
 *
 * Notes:
 * - Email is used as the unique login identifier.
 * - Password stores a bcrypt hash, never the plain password.
 * - Password is excluded from queries by default using `select: false`.
 * ------------------------------------------------------------------
 */
const userSchema = new mongoose.Schema(
  {
    /**
     * Full name of the user.
     */
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    /**
     * User email.
     *
     * This acts as the unique username for authentication.
     */
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },

    /**
     * Password Hash
     *
     * IMPORTANT:
     * Never store plain-text passwords.
     *
     * `select: false` ensures the password hash is excluded
     * from all queries unless explicitly requested.
     */
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
  },
  {
    /**
     * Automatically adds:
     * - createdAt
     * - updatedAt
     */
    timestamps: true,

    /**
     * Removes the internal "__v" version key.
     */
    versionKey: false,
  }
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;