const Leave = require("../models/Leave");
const User = require("../models/User");

exports.applyLeave = async (req, res) => {
  try {
    const { from, to, reason, leaveType } = req.body;

    if (!from || !to || !reason) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);
    const days = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;

    const leave = await Leave.create({
      user: req.user.id,
      from: fromDate,
      to: toDate,
      reason,
      leaveType: leaveType || "CASUAL",
      days
    });

    res.status(201).json({ message: "Leave request submitted", leave });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.myLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ user: req.user.id })
      .populate("user", "name email")
      .populate("approvedBy", "name email")
      .sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTeamLeaves = async (req, res) => {
  try {
    const employees = await User.find({ managerId: req.user.id });
    const employeeIds = employees.map(e => e._id);
    employeeIds.push(req.user.id); 

    const leaves = await Leave.find({ user: { $in: employeeIds } })
      .populate("user", "name email designation")
      .populate("approvedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate("user", "name email designation")
      .populate("approvedBy", "name email")
      .sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    
    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      {
        status,
        approvedBy: req.user.id,
        rejectionReason: status === "REJECTED" ? rejectionReason : undefined
      },
      { new: true }
    ).populate("user", "name email").populate("approvedBy", "name email");

    if (!leave) return res.status(404).json({ message: "Leave request not found" });

    res.json({ message: `Leave ${status.toLowerCase()}`, leave });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.leaveStats = async (req, res) => {
  try {
    const stats = await Leave.aggregate([
      { $match: { user: require("mongoose").Types.ObjectId(req.user.id) } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
