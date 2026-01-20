import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

const Calendar = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const role = localStorage.getItem("role");
  const [year, setYear] = useState(new Date().getFullYear());

  const [formData, setFormData] = useState({
    name: "",
    date: "",
    type: "NATIONAL",
    description: ""
  });

  useEffect(() => {
    fetchHolidays();
  }, [year]);

  const fetchHolidays = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/holidays?year=${year}`);
      setHolidays(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch holidays");
    } finally {
      setLoading(false);
    }
  };

  const handleAddHoliday = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.date) {
      setError("Name and date are required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await api.post("/holidays", formData);
      setSuccess("Holiday added successfully!");
      setFormData({ name: "", date: "", type: "NATIONAL", description: "" });
      setShowForm(false);
      setTimeout(() => setSuccess(""), 3000);
      fetchHolidays();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add holiday");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHoliday = async (holidayId) => {
    if (window.confirm("Are you sure you want to delete this holiday?")) {
      try {
        setLoading(true);
        await api.delete(`/holidays/${holidayId}`);
        setSuccess("Holiday deleted successfully!");
        setTimeout(() => setSuccess(""), 3000);
        fetchHolidays();
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete holiday");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar role={role} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex-1 overflow-auto">
          <div className="p-4 md:p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl md:text-4xl font-bold text-gray-800">Holiday Calendar</h1>
              {role === "OWNER" && (
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm md:text-base transition"
                >
                  {showForm ? "Cancel" : "Add Holiday"}
                </button>
              )}
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

            {showForm && role === "OWNER" && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Add Holiday</h2>
                <form onSubmit={handleAddHoliday} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Holiday Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g., Republic Day"
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                      <option value="NATIONAL">National Holiday</option>
                      <option value="OPTIONAL">Optional Holiday</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Enter description (optional)"
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      rows="3"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded transition"
                  >
                    {loading ? "Adding..." : "Add Holiday"}
                  </button>
                </form>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Filter by Year</h2>
              <div className="flex gap-4">
                <select
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value))}
                  className="border border-gray-300 rounded px-3 py-2"
                >
                  {[2026].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {loading ? (
                <div className="px-4 py-8 text-center text-gray-600">Loading...</div>
              ) : holidays.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-600">No holidays found for the selected year</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Holiday Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Day</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Type</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Description</th>
                        {role === "OWNER" && (
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Action</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {holidays.map((holiday, idx) => {
                        const date = new Date(holiday.date);
                        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                        return (
                          <tr key={idx} className="border-t border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-semibold text-gray-800">{holiday.name}</td>
                            <td className="px-4 py-3 text-sm">{date.toLocaleDateString()}</td>
                            <td className="px-4 py-3 text-sm">{dayName}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                holiday.type === "NATIONAL" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                              }`}>
                                {holiday.type}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">{holiday.description || "-"}</td>
                            {role === "OWNER" && (
                              <td className="px-4 py-3 text-sm">
                                <button
                                  onClick={() => handleDeleteHoliday(holiday._id)}
                                  className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs transition"
                                >
                                  Delete
                                </button>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
