import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AnokBrand } from "../components/AnokBrand";
import { useAuth } from "../contexts/AuthContext";
import { useGoogleIdentity } from "../hooks/useGoogleIdentity";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const { promptSignIn, ready: googleReady } = useGoogleIdentity({
    clientId: googleClientId,
    onCredential: async (idToken) => {
      setError("");
      setIsLoading(true);
      try {
        await googleLogin(idToken);
        navigate("/");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Google sign-in failed");
      } finally {
        setIsLoading(false);
      }
    },
    onError: (msg) => setError(msg),
  });

  const handleGoogleLogin = () => {
    setError("");
    if (!googleReady) {
      setError("Google Sign-In is not ready yet. Please try again in a moment.");
      return;
    }
    promptSignIn();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login({ email, password });
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#0f0f1a] flex items-center justify-center px-4 fade-in-up">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-[#1a1a2e]/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-[#b11226]/20 p-8">
          <div className="flex justify-center mb-6">
            <AnokBrand />
          </div>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome to <span className="text-[#b11226]">Anok</span>Events
            </h1>
            <p className="text-gray-400">Sign in to your account</p>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={!googleReady || isLoading}
            className="w-full bg-white text-gray-900 font-semibold py-3 rounded-lg transition-all duration-300 hover:bg-gray-100 border border-white/20 flex items-center justify-center gap-3 mb-6 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.12 0 5.9 1.08 8.1 2.84l6.06-6.06C34.88 2.7 29.79.5 24 .5 14.66.5 6.7 5.9 2.97 13.4l7.46 5.8C11.67 13.08 17.3 9.5 24 9.5Z"
              />
              <path
                fill="#34A853"
                d="M46.13 24.5c0-1.35-.12-2.65-.34-3.9H24v8.02h12.44c-.54 2.76-2.17 5.1-4.56 6.66l7.17 5.58C43.75 36.34 46.13 30.8 46.13 24.5Z"
              />
              <path
                fill="#4A90E2"
                d="M10.43 28.63A14.5 14.5 0 0 1 9.5 24c0-1.61.27-3.16.76-4.61l-7.46-5.8A23.42 23.42 0 0 0 .88 24c0 3.76.9 7.31 2.92 10.41l7.46-5.78Z"
              />
              <path
                fill="#FBBC05"
                d="M24 47.5c6.14 0 11.3-2.02 15.06-5.49l-7.17-5.58c-2.02 1.35-4.6 2.16-7.89 2.16-6.7 0-12.33-3.58-15.13-8.73L1.24 34.41C4.98 41.97 13 47.5 24 47.5Z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 text-gray-500 text-xs uppercase tracking-[0.2em] mb-4">
            <span className="flex-1 h-px bg-white/10" />
            <span>Email login</span>
            <span className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b11226] focus:border-transparent transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b11226] focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#b11226] hover:bg-[#d31a33] text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed btn-animated"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-[#b11226] hover:text-[#d31a33] font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
