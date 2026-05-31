const mongoose = require("mongoose");

const userSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true,
        unique: true,
      },

      password: {
        type: String,
        required: true,
      },

      avatar: {
        type: String,
        default: "",
      },

      role: {
        type: String,
        enum: [
          "user",
          "doctor",
          "admin",
        ],
        default: "user",
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.models.User ||
  mongoose.model(
    "User",
    userSchema
  );