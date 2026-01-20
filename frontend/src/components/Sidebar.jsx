import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const Sidebar = ({ role }) => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const baseLinks = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/attendance", label: "Attendance", icon: "📋" },
    { path: "/leave", label: "Leave", icon: "📅" },
    { path: "/salary", label: "Salary", icon: "💰" },
    { path: "/calendar", label: "Calendar", icon: "📆" }
  ];

  const ownerLinks = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/employees", label: "Employees", icon: "👥" },
    { path: "/attendance", label: "Attendance", icon: "📋" },
    { path: "/leave", label: "Leave Requests", icon: "📅" },
    { path: "/salary", label: "Salary", icon: "💰" },
    { path: "/calendar", label: "Holidays", icon: "📆" }
  ];

  const leadLinks = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/attendance", label: "Team Attendance", icon: "📋" },
    { path: "/leave", label: "Team Leaves", icon: "📅" },
    { path: "/salary", label: "Salary", icon: "💰" },
    { path: "/calendar", label: "Calendar", icon: "📆" }
  ];

  let links = baseLinks;
  if (role === "OWNER") links = ownerLinks;
  else if (role === "LEAD") links = leadLinks;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg z-40"
      >
        ☰
      </button>

      {/* Sidebar */}
      <div
        className={`${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:relative w-64 h-screen bg-gray-800 text-white transition-transform duration-300 z-30 overflow-y-auto`}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold mb-8">Navigation</h2>
          <nav className="space-y-2">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-lg transition ${
                  isActive(link.path)
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-20"
        />
      )}
    </>
  );
};

export default Sidebar;
