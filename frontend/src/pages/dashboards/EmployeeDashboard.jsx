import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";

const EmployeeDashboard = () => {
  const [stats, setStats] = useState({
    totalHours: 0,
    approvedLeaves: 0,
    salary: 0,
    status: "ON TIME"
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const month = new Date().getMonth() + 1;
      const year = new Date().getFullYear();

      const attRes = await api.get(`/attendance/me?month=${month}&year=${year}`);
      const attendance = attRes.data;
      const totalHours = attendance.reduce((sum, a) => sum + (a.totalHours || 0), 0);

      const leaveRes = await api.get("/leaves/me");
      const leaves = leaveRes.data;
      const approvedLeaves = leaves.filter(l => l.status === "APPROVED").length;

      const salRes = await api.get(`/salary/${month}/${year}`);
      const salary = salRes.data.final || 0;

      setStats({
        totalHours: Math.round(totalHours),
        approvedLeaves,
        salary: Math.round(salary),
        status: "ACTIVE"
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div className={`${color} rounded-lg shadow-lg p-6 text-white`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm md:text-base opacity-80">{title}</p>
          <p className="text-3xl md:text-4xl font-bold">{value}</p>
        </div>
        <div className="text-4xl md:text-5xl opacity-50">{icon}</div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar role="EMPLOYEE" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex-1 overflow-auto">
          <div className="p-4 md:p-8">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-8">My Dashboard</h1>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <StatCard
                  title="Hours Worked"
                  value={stats.totalHours}
                  icon="⏱️"
                  color="bg-gradient-to-br from-blue-500 to-blue-700"
                />
                <StatCard
                  title="Approved Leaves"
                  value={stats.approvedLeaves}
                  icon="✅"
                  color="bg-gradient-to-br from-green-500 to-green-700"
                />
                <StatCard
                  title="This Month Salary"
                  value={`₹${stats.salary}`}
                  icon="💰"
                  color="bg-gradient-to-br from-orange-500 to-orange-700"
                />
                <StatCard
                  title="Status"
                  value={stats.status}
                  icon="📍"
                  color="bg-gradient-to-br from-purple-500 to-purple-700"
                />
              </div>
            )}

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <a href="/attendance" className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-center transition">
                    Mark Attendance
                  </a>
                  <a href="/leave" className="block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-center transition">
                    Apply for Leave
                  </a>
                  <a href="/salary" className="block bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded text-center transition">
                    View Salary
                  </a>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Updates</h3>
                <p className="text-gray-600 text-sm">
                  • Check your attendance records regularly
                  <br/>
                  • Apply leave in advance
                  <br/>
                  • Review salary details
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
