import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

const Salary = () => {
  const [salaries, setSalaries] = useState([]);
  const [stats, setStats] = useState({
    totalEarned: 0,
    totalDeductions: 0,
    avgSalary: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const role = localStorage.getItem("role");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchSalaries();
    fetchStats();
  }, [month, year]);

  const fetchSalaries = async () => {
    try {
      setLoading(true);
      let res;
      if (role === "OWNER") {
        res = await api.get(`/salary/all?month=${month}&year=${year}`);
      } else {
        res = await api.get(`/salary/me?month=${month}&year=${year}`);
      }
      setSalaries(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch salaries");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get(`/salary/stats?year=${year}`);
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats");
    }
  };

  const calculateSalaryIfNeeded = async (month, year) => {
    try {
      await api.get(`/salary/${month}/${year}`);
      fetchSalaries();
    } catch (err) {
      console.error("Failed to calculate salary");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar role={role} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex-1 overflow-auto">
          <div className="p-4 md:p-8">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-8">Salary Management</h1>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {role === "EMPLOYEE" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
                <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-lg shadow-lg p-6 text-white">
                  <p className="text-sm md:text-base opacity-80">Total Earned (YTD)</p>
                  <p className="text-3xl md:text-4xl font-bold">₹{stats.totalEarned || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-lg shadow-lg p-6 text-white">
                  <p className="text-sm md:text-base opacity-80">Total Deductions (YTD)</p>
                  <p className="text-3xl md:text-4xl font-bold">₹{stats.totalDeductions || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow-lg p-6 text-white">
                  <p className="text-sm md:text-base opacity-80">Average Monthly Salary</p>
                  <p className="text-3xl md:text-4xl font-bold">₹{Math.round(stats.avgSalary) || 0}</p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Filter</h2>
              <div className="flex gap-4 flex-wrap">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Month</label>
                  <select
                    value={month}
                    onChange={(e) => setMonth(parseInt(e.target.value))}
                    className="border border-gray-300 rounded px-3 py-2"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                      <option key={m} value={m}>{new Date(2000, m-1).toLocaleString('default', { month: 'long' })}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Year</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                    className="border border-gray-300 rounded px-3 py-2"
                  >
                    {[2024, 2025, 2026].map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => calculateSalaryIfNeeded(month, year)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                  >
                    Calculate
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-200">
                    <tr>
                      {role === "OWNER" && <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Employee</th>}
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Month</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Base</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Days Worked</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Leaves</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Deductions</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Final Salary</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={role === "OWNER" ? 8 : 7} className="px-4 py-8 text-center text-gray-600">Loading...</td>
                      </tr>
                    ) : salaries.length === 0 ? (
                      <tr>
                        <td colSpan={role === "OWNER" ? 8 : 7} className="px-4 py-8 text-center text-gray-600">No salary records found</td>
                      </tr>
                    ) : (
                      salaries.map((salary, idx) => (
                        <tr key={idx} className="border-t border-gray-200 hover:bg-gray-50">
                          {role === "OWNER" && <td className="px-4 py-3 text-sm">{salary.user.name}</td>}
                          <td className="px-4 py-3 text-sm">{salary.month}/{salary.year}</td>
                          <td className="px-4 py-3 text-sm">₹{salary.base || 0}</td>
                          <td className="px-4 py-3 text-sm">{salary.daysWorked || 0}</td>
                          <td className="px-4 py-3 text-sm">{salary.leaveTaken || 0}</td>
                          <td className="px-4 py-3 text-sm">₹{salary.deductions || 0}</td>
                          <td className="px-4 py-3 text-sm font-bold">₹{salary.final || 0}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              salary.status === "PAID" ? "bg-green-100 text-green-800" :
                              salary.status === "APPROVED" ? "bg-blue-100 text-blue-800" :
                              "bg-yellow-100 text-yellow-800"
                            }`}>
                              {salary.status}
                            </span>
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

export default Salary;
