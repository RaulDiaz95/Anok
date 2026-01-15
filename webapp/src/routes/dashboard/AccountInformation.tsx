import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";

export default function AccountInformation() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.fullName || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const roles = useMemo(() => user?.roles || [], [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    if (password && password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    setMessage("Profile updated (client-side placeholder).");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Account Information</h1>
        {message && <span className="text-sm text-[#f7c0c7]">{message}</span>}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-xl p-5 shadow-lg"
        >
          <h2 className="text-lg font-semibold mb-4">Profile</h2>
          <div className="space-y-2 text-sm text-gray-300">
            <p><span className="text-gray-400">Name:</span> {user?.fullName}</p>
            <p><span className="text-gray-400">Email:</span> {user?.email}</p>
            <p><span className="text-gray-400">Roles:</span> {roles.join(", ") || "User"}</p>
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white/5 border border-white/10 rounded-xl p-5 shadow-lg space-y-4"
        >
          <h2 className="text-lg font-semibold">Update Details</h2>
          <div className="space-y-1">
            <label className="text-sm text-gray-300">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-[#0f0f1a]/60 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#b11226]"
              placeholder="Your name"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-gray-300">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-[#0f0f1a]/60 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#b11226]"
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-gray-300">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 bg-[#0f0f1a]/60 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#b11226]"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="btn-animated px-4 py-2 bg-[#b11226] hover:bg-[#d31a33] rounded-lg text-white font-semibold shadow-lg shadow-[#b11226]/30"
          >
            Save Changes
          </button>
        </motion.form>
      </div>
    </div>
  );
}
