const Attendance = require("../models/Attendance");
const Leave = require("../models/Leave");
const Holiday = require("../models/Holiday");
const Salary = require("../models/Salary");
const User = require("../models/User");

exports.calculateSalary = async (req, res) => {
  try {
    const { month, year } = req.params;
    const userId = req.user.id;

    const monthNum = parseInt(month);
    const yearNum = parseInt(year);
    if (!monthNum || !yearNum) return res.status(400).json({ message: "Invalid month or year" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const baseSalary = Number(user.salary) || 0;

    const startDate = new Date(yearNum, monthNum - 1, 1);
    const endDate = new Date(yearNum, monthNum, 0);

    const holidays = await Holiday.find({ date: { $gte: startDate, $lte: endDate } });
    const holidaySet = new Set(holidays.map(h => new Date(h.date).toDateString()));

    const countBusinessDays = (from, to) => {
      let count = 0;
      for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
        const day = d.getDay();
        if (day === 0 || day === 6) continue; 
        if (holidaySet.has(new Date(d).toDateString())) continue; 
        count++;
      }
      return count;
    };

    const workingDays = countBusinessDays(startDate, endDate) || 0;

    const presentRecords = await Attendance.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate },
      status: "PRESENT"
    });
    const presentSet = new Set(presentRecords.map(r => new Date(r.date).toDateString()));
    const presentDays = presentSet.size;

    const approvedLeaves = await Leave.find({
      user: userId,
      status: "APPROVED",
      $or: [
        { from: { $gte: startDate, $lte: endDate } },
        { to: { $gte: startDate, $lte: endDate } },
        { from: { $lte: startDate }, to: { $gte: endDate } }
      ]
    });

    let approvedLeaveDays = 0;
    approvedLeaves.forEach(lv => {
      const from = new Date(Math.max(new Date(lv.from), startDate));
      const to = new Date(Math.min(new Date(lv.to), endDate));
      approvedLeaveDays += countBusinessDays(from, to);
    });

    const paidDays = Math.min(presentDays + approvedLeaveDays, workingDays);
    const absentDays = Math.max(workingDays - paidDays, 0);

    const perDay = workingDays > 0 ? (baseSalary / workingDays) : 0;
    const absenceDeduction = Math.round(absentDays * perDay * 100) / 100;

    const taxPct = parseFloat(process.env.SALARY_TAX_PERCENT || 0);
    const pfPct = parseFloat(process.env.SALARY_PF_PERCENT || 0);
    const taxDeduction = Math.round(((baseSalary - absenceDeduction) * (taxPct / 100)) * 100) / 100;
    const pfDeduction = Math.round(((baseSalary - absenceDeduction) * (pfPct / 100)) * 100) / 100;
    const miscDeductions = parseFloat(process.env.SALARY_MISC_DEDUCTION || 0);

    const totalDeductions = Math.round((absenceDeduction + taxDeduction + pfDeduction + miscDeductions) * 100) / 100;
    const netSalary = Math.round((baseSalary - totalDeductions) * 100) / 100;

    const salaryRecord = await Salary.findOneAndUpdate(
      { user: userId, month: monthNum, year: yearNum },
      {
        user: userId,
        month: monthNum,
        year: yearNum,
        base: baseSalary,
        workingDays,
        presentDays,
        leaveTaken: approvedLeaveDays,
        absentDays,
        perDay: Math.round(perDay * 100) / 100,
        deductions: totalDeductions,
        breakdown: {
          absenceDeduction,
          taxDeduction,
          pfDeduction,
          miscDeductions
        },
        final: Math.max(netSalary, 0)
      },
      { new: true, upsert: true }
    );

    res.json(salaryRecord);
  } catch (error) {
    console.error('Salary calc error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getMySalary = async (req, res) => {
  try {
    const { month, year } = req.query;
    let query = { user: req.user.id };

    if (month && year) {
      query.month = parseInt(month);
      query.year = parseInt(year);
    }

    const salary = await Salary.find(query).sort({ year: -1, month: -1 });
    res.json(salary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllSalaries = async (req, res) => {
  try {
    const { month, year, userId } = req.query;
    let query = {};

    if (userId) query.user = userId;
    if (month && year) {
      query.month = parseInt(month);
      query.year = parseInt(year);
    }

    const salaries = await Salary.find(query)
      .populate("user", "name email designation department")
      .sort({ year: -1, month: -1 });

    res.json(salaries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSalaryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const salary = await Salary.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("user", "name email");

    if (!salary) return res.status(404).json({ message: "Salary record not found" });

    res.json(salary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSalaryStats = async (req, res) => {
  try {
    const { year } = req.query;
    const currentYear = year || new Date().getFullYear();
    const mongoose = require("mongoose");

    const stats = await Salary.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id),
          year: parseInt(currentYear)
        }
      },
      {
        $group: {
          _id: null,
          totalEarned: { $sum: "$final" },
          totalDeductions: { $sum: "$deductions" },
          avgSalary: { $avg: "$final" }
        }
      }
    ]);

    res.json(stats[0] || { totalEarned: 0, totalDeductions: 0, avgSalary: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
