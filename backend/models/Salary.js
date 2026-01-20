const mongoose = require("mongoose");

const salarySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    month: { type: String, required: true },
    year: { type: Number, required: true },
    base: Number,
    daysWorked: { type: Number, default: 0 },
    leaveTaken: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    final: Number,
    status: { type: String, enum: ["DRAFT", "APPROVED", "PAID"], default: "DRAFT" }
  },
  { timestamps: true }
);

salarySchema.index({ user: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model("Salary", salarySchema);
