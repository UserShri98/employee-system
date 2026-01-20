const User = require("../models/User");

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: "EMPLOYEE" }).select("-password");
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id).select("-password");
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createEmployee = async (req, res) => {
  try {
    const { name, email, password, phone, designation, department, salary, joiningDate } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const bcrypt = require("bcryptjs");
    const hashed = await bcrypt.hash(password, 10);

    const employee = await User.create({
      name,
      email,
      password: hashed,
      phone,
      designation,
      department,
      salary: salary || 30000,
      joiningDate: joiningDate || new Date(),
      role: "EMPLOYEE",
      status: "ACTIVE"
    });

    res.status(201).json({ message: "Employee created", employee: { id: employee._id, name: employee.name, email: employee.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const employee = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select("-password");
    
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTeamLeads = async (req, res) => {
  try {
    const leads = await User.find({ role: "LEAD" }).select("-password");
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
