import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    designation: "",
    department: "",
    salary: 30000,
    joiningDate: ""
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await api.get("/employees");
      setEmployees(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError("Name, email, and password are required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await api.post("/employees", formData);
      setSuccess("Employee added successfully!");
      resetForm();
      setTimeout(() => setSuccess(""), 3000);
      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add employee");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        setLoading(true);
        await api.delete(`/employees/${employeeId}`);
        setSuccess("Employee deleted successfully!");
        setTimeout(() => setSuccess(""), 3000);
        fetchEmployees();
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete employee");
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      designation: "",
      department: "",
      salary: 30000,
      joiningDate: ""
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar role="OWNER" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex-1 overflow-auto">
          <div className="p-4 md:p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl md:text-4xl font-bold text-gray-800">Employee Management</h1>
              <button
                onClick={() => {
                  setShowForm(!showForm);
                  if (showForm) resetForm();
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm md:text-base transition"
              >
                {showForm ? "Cancel" : "Add Employee"}
              </button>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {success}
              </div>
            )}

            {showForm && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Employee</h2>
                <form onSubmit={handleAddEmployee} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Designation</label>
                    <input
                      type="text"
                      value={formData.designation}
                      onChange={(e) => setFormData({...formData, designation: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Salary</label>
                    <input
                      type="number"
                      value={formData.salary}
                      onChange={(e) => setFormData({...formData, salary: parseInt(e.target.value)})}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Joining Date</label>
                    <input
                      type="date"
                      value={formData.joiningDate}
                      onChange={(e) => setFormData({...formData, joiningDate: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="md:col-span-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded transition"
                  >
                    {loading ? "Adding..." : "Add Employee"}
                  </button>
                </form>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Designation</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Department</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Salary</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading && !employees.length ? (
                      <tr>
                        <td colSpan="6" className="px-4 py-8 text-center text-gray-600">Loading...</td>
                      </tr>
                    ) : employees.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-4 py-8 text-center text-gray-600">No employees found</td>
                      </tr>
                    ) : (
                      employees.map((emp, idx) => (
                        <tr key={idx} className="border-t border-gray-200 hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-semibold text-gray-800">{emp.name}</td>
                          <td className="px-4 py-3 text-sm">{emp.email}</td>
                          <td className="px-4 py-3 text-sm">{emp.designation || "-"}</td>
                          <td className="px-4 py-3 text-sm">{emp.department || "-"}</td>
                          <td className="px-4 py-3 text-sm">₹{emp.salary || 30000}</td>
                          <td className="px-4 py-3 text-sm">
                            <button
                              onClick={() => handleDeleteEmployee(emp._id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs transition"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Employees;
