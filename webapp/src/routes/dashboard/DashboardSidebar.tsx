import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, User, BarChart3, LifeBuoy, Menu } from "lucide-react";
import { AnokBrand } from "../../components/AnokBrand";
import { useAuth } from "../../contexts/AuthContext";
import { ShieldCheck } from "lucide-react";

export default function DashboardSidebar() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const navItems = useMemo(() => {
    const items = [
      { to: "/dashboard/events", label: "My Events", icon: LayoutDashboard },
      { to: "/dashboard/account", label: "Account Information", icon: User },
      { to: "/dashboard/metrics", label: "Performance Metrics", icon: BarChart3 },
      { to: "/dashboard/support", label: "Support & Resources", icon: LifeBuoy },
    ];
    if (user?.roles?.includes("ROLE_SUPERUSER")) {
      items.splice(1, 0, { to: "/dashboard/admin/review-events", label: "Admin Review", icon: ShieldCheck });
    }
    return items;
  }, [user]);

  return (
    <aside className="w-64 h-[calc(100vh-96px)] sticky top-24 flex flex-col bg-[#0f0f1a]/80 backdrop-blur-md border-r border-white/5">
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/5 sm:border-none">
        <AnokBrand />
        <button
          className="sm:hidden p-2 rounded-lg border border-white/10 hover:bg-white/5 transition"
          onClick={() => setOpen((prev) => !prev)}
        >
          <Menu size={18} />
        </button>
      </div>
      <nav className={`sm:block ${open ? "block" : "hidden"} px-3 pb-4 sm:pb-0`}>
        <ul className="space-y-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-xl transition hover:scale-[1.02] hover:shadow-lg hover:shadow-[#b11226]/30 ${
                    isActive
                      ? "bg-[#b11226]/15 border border-[#b11226]/40 text-white"
                      : "bg-white/5 border border-white/5 text-gray-200"
                  }`
                }
                onClick={() => setOpen(false)}
              >
                <Icon size={18} className="text-[#f25f6b]" />
                <span className="font-medium">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
