import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

const Leave = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const role = localStorage.getItem("role");

  const [formData, setFormData] = useState({
    from: "",
    to: "",
    reason: "",
    leaveType: "CASUAL"
  });

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      let res;
      if (role === "OWNER") {
        res = await api.get("/leaves/all");
      } else if (role === "LEAD") {
        res = await api.get("/leaves/team");
      } else {
        res = await api.get("/leaves/me");
      }
      setLeaves(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch leaves");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    if (!formData.from || !formData.to || !formData.reason) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await api.post("/leaves", formData);
      setSuccess("Leave request submitted successfully!");
      setFormData({ from: "", to: "", reason: "", leaveType: "CASUAL" });
      setShowForm(false);
      setTimeout(() => setSuccess(""), 3000);
      fetchLeaves();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to apply leave");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveReject = async (leaveId, status) => {
    try {
      setLoading(true);
      await api.patch(`/leaves/${leaveId}`, { status });
      setSuccess(`Leave ${status.toLowerCase()}!`);
      setTimeout(() => setSuccess(""), 3000);
      fetchLeaves();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update leave");
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
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl md:text-4xl font-bold text-gray-800">Leave Management</h1>
              {role === "EMPLOYEE" && (
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm md:text-base transition"
                >
                  {showForm ? "Cancel" : "Apply Leave"}
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

            {showForm && role === "EMPLOYEE" && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Apply for Leave</h2>
                <form onSubmit={handleApplyLeave} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">From Date</label>
                    <input
                      type="date"
                      value={formData.from}
                      onChange={(e) => setFormData({...formData, from: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">To Date</label>
                    <input
                      type="date"
                      value={formData.to}
                      onChange={(e) => setFormData({...formData, to: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Leave Type</label>
                    <select
                      value={formData.leaveType}
                      onChange={(e) => setFormData({...formData, leaveType: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                      <option value="CASUAL">Casual Leave</option>
                      <option value="SICK">Sick Leave</option>
                      <option value="EARNED">Earned Leave</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Reason</label>
                    <textarea
                      value={formData.reason}
                      onChange={(e) => setFormData({...formData, reason: e.target.value})}
                      placeholder="Enter reason for leave"
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      rows="4"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded transition"
                  >
                    {loading ? "Submitting..." : "Submit Leave Request"}
                  </button>
                </form>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Employee</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">From</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">To</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Days</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Status</th>
                      {(role === "OWNER" || role === "LEAD") && (
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">Action</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={role === "OWNER" || role === "LEAD" ? 7 : 6} className="px-4 py-8 text-center text-gray-600">Loading...</td>
                      </tr>
                    ) : leaves.length === 0 ? (
                      <tr>
                        <td colSpan={role === "OWNER" || role === "LEAD" ? 7 : 6} className="px-4 py-8 text-center text-gray-600">No leave records found</td>
                      </tr>
                    ) : (
                      leaves.map((leave, idx) => (
                        <tr key={idx} className="border-t border-gray-200 hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{role === "EMPLOYEE" ? "Me" : leave.user.name}</td>
                          <td className="px-4 py-3 text-sm">{new Date(leave.from).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-sm">{new Date(leave.to).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-sm">{leave.days || "-"}</td>
                          <td className="px-4 py-3 text-sm">{leave.leaveType}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              leave.status === "APPROVED" ? "bg-green-100 text-green-800" :
                              leave.status === "REJECTED" ? "bg-red-100 text-red-800" :
                              "bg-yellow-100 text-yellow-800"
                            }`}>
                              {leave.status}
                            </span>
                          </td>
                          {(role === "OWNER" || role === "LEAD") && leave.status === "PENDING" && (
                            <td className="px-4 py-3 text-sm space-x-2">
                              <button
                                onClick={() => handleApproveReject(leave._id, "APPROVED")}
                                className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs transition"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleApproveReject(leave._id, "REJECTED")}
                                className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs transition"
                              >
                                Reject
                              </button>
                            </td>
                          )}
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

export default Leave;
