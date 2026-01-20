const Attendance = require("../models/Attendance");
const mongoose = require("mongoose");

exports.punchIn = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const exists = await Attendance.findOne({
      user: req.user.id,
      date: { $gte: today, $lt: tomorrow }
    });

    if (exists && exists.checkIn) {
      return res.status(400).json({ message: "Already punched in today" });
    }

    const record = await Attendance.create({
      user: req.user.id,
      date: today,
      checkIn: new Date(),
      status: "PRESENT"
    });

    res.json({ message: "Punch in successful", record });
  } catch (error) {
    console.error("Punch in error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.punchOut = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const record = await Attendance.findOne({
      user: req.user.id,
      date: { $gte: today, $lt: tomorrow }
    });

    if (!record) {
      return res.status(400).json({ message: "No punch in record found for today" });
    }

    if (record.checkOut) {
      return res.status(400).json({ message: "Already punched out" });
    }

    record.checkOut = new Date();
    if (record.checkIn) {
      record.totalHours = (record.checkOut - record.checkIn) / (1000 * 60 * 60);
    }

    await record.save();
    res.json({ message: "Punch out successful", record });
  } catch (error) {
    console.error("Punch out error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.myAttendance = async (req, res) => {
  try {
    const { month, year } = req.query;
    let query = { user: req.user.id };

    if (month && year) {
      const startDate = new Date(year, parseInt(month) - 1, 1);
      const endDate = new Date(year, parseInt(month), 0);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const records = await Attendance.find(query).sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const { userId, month, year } = req.query;
    let query = {};

    if (userId) query.user = userId;
    if (month && year) {
      const startDate = new Date(year, parseInt(month) - 1, 1);
      const endDate = new Date(year, parseInt(month), 0);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const records = await Attendance.find(query).populate("user", "name email designation").sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAttendanceStats = async (req, res) => {
  try {
    const { month, year } = req.query;
    
    if (!month || !year) {
      return res.status(400).json({ message: "Month and year are required" });
    }

    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0);

    const stats = await Attendance.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id),
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(stats || []);
  } catch (error) {
    console.error("Attendance stats error:", error);
    res.status(500).json({ message: error.message });
  }
};
