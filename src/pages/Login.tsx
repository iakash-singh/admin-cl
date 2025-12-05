// src/pages/Login.tsx
import { useState } from "react";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../SupabaseClient/supabaseClient"; // keep this if your folder is named exactly 'SupabseClient'

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log("🔐 Logging in with:", { email, password });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log("🔁 Supabase response:", { data, error });

    setLoading(false);

    if (error || !data || !data.user) {
      const message =
        error?.message ||
        "Login failed. Check email/password or Supabase config.";
      setError(message);
      console.error("❌ Login error:", message);
      return;
    }

    // success
    console.log("✅ Login success, user:", data.user);

    localStorage.setItem("user", JSON.stringify(data.user));
    navigate("/app");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        <div className="flex flex-col items-center mb-6">
          <LogIn className="text-green-600 w-10 h-10 mb-2" />
          <h1 className="text-2xl font-semibold text-gray-800">
            RentAdmin Login
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back! Please sign in to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 focus:border-green-600 focus:ring focus:ring-green-100 rounded-lg p-2.5 outline-none transition"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 focus:border-green-600 focus:ring focus:ring-green-100 rounded-lg p-2.5 outline-none transition"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg shadow transition disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Forgot your password?{" "}
          <a href="#" className="text-green-600 hover:underline">
            Reset here
          </a>
        </p>
      </div>
    </div>
  );
}
