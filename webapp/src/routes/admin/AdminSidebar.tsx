import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Overview", to: "/admin" },
  { label: "All Events", to: "/admin/events" },
  { label: "Pending Approval", to: "/admin/events/pending" },
  { label: "Live Events", to: "/admin/events/live" },
  { label: "Disabled Events", to: "/admin/events/disabled" },
  { label: "Deleted Events", to: "/admin/events/deleted" },
];

export default function AdminSidebar() {
  return (
    <aside className="w-full md:w-64 border-r border-white/10 bg-black/20 p-4 md:p-6">
      <div className="text-lg font-semibold text-white mb-4">Admin Panel</div>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg text-sm transition ${
                isActive
                  ? "bg-[#b11226]/20 text-white border border-[#b11226]/40"
                  : "text-gray-300 hover:bg-white/5"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
