import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { AnokBrand } from "./AnokBrand";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setMenuOpen(false);
    navigate("/");
  };

  const handleDashboard = () => {
    navigate("/dashboard/events");
    setProfileOpen(false);
    setMenuOpen(false);
  };

  const handleCreateEvent = () => {
    navigate("/events/new");
    setMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled ? "bg-[#0f0f1a]/90 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12 py-4 text-white">
        <AnokBrand />

        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-3 items-center">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#b11226]/10 hover:bg-[#b11226]/20 border border-[#b11226]/30 transition-all"
                >
                  <User size={18} className="text-[#b11226]" />
                  <span className="text-white font-medium">{user?.fullName}</span>
                </button>

                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-[#1a1a2e] border border-[#b11226]/20 rounded-lg shadow-xl overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-[#b11226]/20">
                      <p className="text-sm text-gray-400">Signed in as</p>
                      <p className="text-white font-medium truncate">{user?.email}</p>
                    </div>
                    <button
                      onClick={handleDashboard}
                      className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-[#b11226]/10 transition-colors text-white border-b border-[#b11226]/20"
                    >
                      <User size={16} />
                      <span>Dashboard</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-[#b11226]/10 transition-colors text-white"
                    >
                      <LogOut size={16} />
                      <span>Sign out</span>
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-2 bg-[#b11226] hover:bg-[#d31a33] text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 btn-animated"
              >
                Login
              </button>
            )}
          </div>

          <button
            className="md:hidden text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            â˜°
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#0f0f1a]/95 backdrop-blur-lg border-t border-[#b11226]/20">
          <ul className="flex flex-col items-center py-4 space-y-4 text-lg font-medium">
            {isAuthenticated ? (
              <>
                <li className="border-t border-[#b11226]/20 pt-4 w-full text-center">
                  <div className="text-gray-400 text-sm mb-2">Signed in as</div>
                  <div className="text-[#b11226] font-semibold">{user?.fullName}</div>
                </li>
                <li className="w-full px-6">
                  <button
                    onClick={handleDashboard}
                    className="w-full px-4 py-2 border border-[#b11226]/40 rounded-lg text-white hover:bg-[#b11226]/10 transition"
                  >
                    Dashboard
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-6 py-2 bg-[#b11226]/10 hover:bg-[#b11226]/20 border border-[#b11226]/30 rounded-lg transition-all"
                  >
                    <LogOut size={16} />
                    <span>Sign out</span>
                  </button>
                </li>
              </>
            ) : (
              <li className="pt-2">
                <button
                  onClick={() => {
                    navigate("/login");
                    setMenuOpen(false);
                  }}
                  className="px-8 py-2 bg-[#b11226] hover:bg-[#d31a33] text-white font-semibold rounded-lg transition-all"
                >
                  Login
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </motion.nav>
  );
}

