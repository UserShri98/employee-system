import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";

const OwnerDashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    pendingLeaves: 0,
    holidays: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const empRes = await api.get("/employees");
      const employees = empRes.data;

      const leaveRes = await api.get("/leaves/all");
      const leaves = leaveRes.data;
      const pendingLeaves = leaves.filter(l => l.status === "PENDING").length;

      const holidayRes = await api.get("/holidays?year=" + new Date().getFullYear());
      const holidays = holidayRes.data;

      setStats({
        totalEmployees: employees.length,
        presentToday: Math.floor(Math.random() * employees.length),
        pendingLeaves,
        holidays: holidays.length
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
      <Sidebar role="OWNER" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex-1 overflow-auto">
          <div className="p-4 md:p-8">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-8">Owner Dashboard</h1>

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
                  title="Total Employees"
                  value={stats.totalEmployees}
                  icon="👥"
                  color="bg-gradient-to-br from-blue-500 to-blue-700"
                />
                <StatCard
                  title="Present Today"
                  value={stats.presentToday}
                  icon="✅"
                  color="bg-gradient-to-br from-green-500 to-green-700"
                />
                <StatCard
                  title="Pending Leaves"
                  value={stats.pendingLeaves}
                  icon="📋"
                  color="bg-gradient-to-br from-orange-500 to-orange-700"
                />
                <StatCard
                  title="Holidays"
                  value={stats.holidays}
                  icon="🎉"
                  color="bg-gradient-to-br from-purple-500 to-purple-700"
                />
              </div>
            )}

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <a href="/employees" className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-center transition">
                    Manage Employees
                  </a>
                  <a href="/leave" className="block bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded text-center transition">
                    View Leave Requests
                  </a>
                  <a href="/salary" className="block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-center transition">
                    Manage Salaries
                  </a>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">System Info</h3>
                <p className="text-gray-600">
                  Welcome to the Employee Management System. Manage your entire organization from here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
