import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentStatus, setCurrentStatus] = useState(null);
  const role = localStorage.getItem("role");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchAttendance();
  }, [month, year]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError("");
      const endpoint = (role === "OWNER" || role === "LEAD")
        ? `/attendance?month=${month}&year=${year}`
        : `/attendance/me?month=${month}&year=${year}`;
      const res = await api.get(endpoint);
      setAttendance(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  };

  const punchIn = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.post("/attendance/punch-in");
      setSuccess("Punched in successfully!");
      setCurrentStatus("in");
      setTimeout(() => setSuccess(""), 3000);
      fetchAttendance();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to punch in";
      setError(errorMsg);
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  const punchOut = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.post("/attendance/punch-out");
      setSuccess("Punched out successfully!");
      setCurrentStatus("out");
      setTimeout(() => setSuccess(""), 3000);
      fetchAttendance();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to punch out";
      setError(errorMsg);
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar role={role} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex-1 overflow-auto">
          <div className="p-4 md:p-8">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-8">Attendance</h1>

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

            {role === "EMPLOYEE" && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Mark Attendance</h2>
                <div className="flex gap-4 flex-wrap">
                  <button
                    onClick={punchIn}
                    disabled={loading || currentStatus === "in" || (attendance.length > 0 && attendance[0]?.checkIn)}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded text-sm md:text-base transition"
                    title={currentStatus === "in" || (attendance.length > 0 && attendance[0]?.checkIn) ? "Already punched in today" : ""}
                  >
                    {loading ? "Processing..." : "Punch In"}
                  </button>
                  <button
                    onClick={punchOut}
                    disabled={loading || currentStatus !== "in" || !attendance[0]?.checkIn || attendance[0]?.checkOut}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-2 rounded text-sm md:text-base transition"
                    title={!attendance[0]?.checkIn ? "Punch in first" : attendance[0]?.checkOut ? "Already punched out" : ""}
                  >
                    {loading ? "Processing..." : "Punch Out"}
                  </button>
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
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Check In</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Check Out</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Hours</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="px-4 py-8 text-center text-gray-600">Loading...</td>
                      </tr>
                    ) : attendance.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-4 py-8 text-center text-gray-600">No attendance records found</td>
                      </tr>
                    ) : (
                      attendance.map((record, idx) => (
                        <tr key={idx} className="border-t border-gray-200 hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{new Date(record.date).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-sm">{record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : "-"}</td>
                          <td className="px-4 py-3 text-sm">{record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : "-"}</td>
                          <td className="px-4 py-3 text-sm">{record.totalHours ? record.totalHours.toFixed(2) : "-"}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              record.status === "PRESENT" ? "bg-green-100 text-green-800" :
                              record.status === "ABSENT" ? "bg-red-100 text-red-800" :
                              "bg-yellow-100 text-yellow-800"
                            }`}>
                              {record.status}
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

export default Attendance;
