const Holiday = require("../models/Holiday");

exports.createHoliday = async (req, res) => {
  try {
    const { name, date, type, description } = req.body;

    if (!name || !date) {
      return res.status(400).json({ message: "Name and date are required" });
    }

    const holiday = await Holiday.create({
      name,
      date: new Date(date),
      type: type || "NATIONAL",
      description
    });

    res.status(201).json({ message: "Holiday created", holiday });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getHolidays = async (req, res) => {
  try {
    const { year } = req.query;
    let query = {};

    if (year) {
      const yearNum = parseInt(year);
      const startDate = new Date(yearNum, 0, 1, 0, 0, 0);
      const endDate = new Date(yearNum, 11, 31, 23, 59, 59);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const holidays = await Holiday.find(query).sort({ date: 1 });
    res.json(holidays);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getHolidayById = async (req, res) => {
  try {
    const holiday = await Holiday.findById(req.params.id);
    if (!holiday) return res.status(404).json({ message: "Holiday not found" });
    res.json(holiday);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateHoliday = async (req, res) => {
  try {
    const holiday = await Holiday.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!holiday) return res.status(404).json({ message: "Holiday not found" });
    res.json(holiday);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteHoliday = async (req, res) => {
  try {
    await Holiday.findByIdAndDelete(req.params.id);
    res.json({ message: "Holiday deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
