import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Bell, LogOut, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { AnokBrand } from "./AnokBrand";
import PageContainer from "./PageContainer";
import { useNotifications } from "../hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { latest, unreadCount, refreshNotifications, markRead } = useNotifications();
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
    setNotificationOpen(false);
  };

  const handleNotifications = async () => {
    if (!notificationOpen) {
      await refreshNotifications(false, 0, 10);
    }
    setNotificationOpen((prev) => !prev);
  };

  const handleNotificationClick = async (id: string, actionUrl?: string | null) => {
    await markRead(id);
    setNotificationOpen(false);
    if (actionUrl) {
      navigate(actionUrl);
      return;
    }
    navigate("/dashboard/notifications");
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
      <PageContainer className="flex items-center justify-between py-4 text-white">
        <AnokBrand />

        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-3 items-center">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={handleNotifications}
                  className="relative flex items-center justify-center w-11 h-11 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition"
                >
                  <Bell size={18} className="text-white" />
                  <AnimatePresence>
                    {unreadCount > 0 && (
                      <motion.span
                        key={unreadCount}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 rounded-full bg-[#b11226] text-white text-[11px] flex items-center justify-center"
                      >
                        {unreadCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
                <AnimatePresence>
                  {notificationOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-80 bg-[#1a1a2e] border border-[#b11226]/20 rounded-lg shadow-xl overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-[#b11226]/20 flex items-center justify-between">
                        <span className="text-sm text-gray-200 font-semibold">Notifications</span>
                        <button
                          onClick={() => navigate("/dashboard/notifications")}
                          className="text-xs text-[#f7c0c7] hover:text-white transition"
                        >
                          View all
                        </button>
                      </div>
                      <div className="max-h-80 overflow-auto">
                        {latest.length === 0 && (
                          <div className="px-4 py-6 text-sm text-gray-400">No notifications yet.</div>
                        )}
                        {latest.map((notification) => (
                          <button
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification.id, notification.actionUrl)}
                            className={`w-full text-left px-4 py-3 border-b border-white/5 hover:bg-white/5 transition ${
                              notification.isRead ? "text-gray-300" : "text-white"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="text-sm font-semibold">{notification.title}</div>
                                {notification.message && (
                                  <div className="text-xs text-gray-400 truncate">
                                    {notification.message}
                                  </div>
                                )}
                              </div>
                              {!notification.isRead && (
                                <span className="mt-1 h-2 w-2 rounded-full bg-[#b11226]" />
                              )}
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-gray-500 mt-2">
                              <span>
                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                              </span>
                              {notification.actionUrl && (
                                <span className="text-[#f7c0c7]">Update</span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
      </PageContainer>

      {menuOpen && (
        <div className="md:hidden bg-[#0f0f1a]/95 backdrop-blur-lg border-t border-[#b11226]/20">
          <ul className="flex flex-col items-center py-4 space-y-4 text-lg font-medium">
            {isAuthenticated ? (
              <>
                <li className="w-full px-6">
                  <button
                    onClick={() => {
                      navigate("/dashboard/notifications");
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-[#b11226]/40 rounded-lg text-white hover:bg-[#b11226]/10 transition"
                  >
                    <Bell size={16} />
                    Notifications
                  </button>
                </li>
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

