import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Navbar from "../../components/NavBar";
import { useAuth } from "../../contexts/AuthContext";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Checking session...
      </div>
    );
  }

  if (!user || !(user.roles?.includes("ROLE_ADMIN") || user.roles?.includes("ROLE_SUPERUSER"))) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f1a] via-[#12121c] to-black text-white">
      <Navbar />
      <div className="flex flex-col md:flex-row min-h-screen pt-24">
        <AdminSidebar />
        <div className="flex-1 p-6 sm:p-8 fade-in-up">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-4 inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition"
          >
            <span className="text-lg">&#8592;</span>
            Back
          </button>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
