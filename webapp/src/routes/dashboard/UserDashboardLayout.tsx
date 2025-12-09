import { Outlet, Navigate } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";
import Navbar from "../../components/NavBar";
import { useAuth } from "../../contexts/AuthContext";

export default function UserDashboardLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Checking session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f1a] via-[#12121c] to-black text-white">
      <Navbar />
      <div className="flex min-h-screen pt-24">
        <DashboardSidebar />
        <div className="flex-1 max-h-[calc(100vh-96px)] overflow-y-auto p-6 sm:p-8 fade-in-up">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
