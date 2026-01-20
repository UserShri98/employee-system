const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phone: String,
    designation: String,
    department: String,
    role: {
      type: String,
      enum: ["OWNER", "LEAD", "EMPLOYEE"],
      default: "EMPLOYEE"
    },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    salary: { type: Number, default: 30000 },
    joiningDate: Date,
    address: String,
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
