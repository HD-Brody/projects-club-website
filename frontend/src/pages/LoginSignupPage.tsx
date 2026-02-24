import React, { useState, useEffect } from "react";
import { authApi, profileApi, authUtils } from "../utils/api";

export default function LoginSignupPage() {
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = authUtils.getToken();
    if (token) {
      // Redirect to profile if already logged in
      window.location.hash = "#/profile";
    }
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const response = await authApi.login(email, password);

    setLoading(false);

    if (response.error) {
      setError(response.error);
      alert(`Login failed: ${response.error}`);
    } else if (response.data) {
      // Store token and redirect to profile
      authUtils.setToken(response.data.access_token);
      window.location.hash = "#/profile";
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const email = formData.get("signup-email") as string;
    const password = formData.get("signup-password") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    // Validate passwords match
    if (password !== confirmPassword) {
      setLoading(false);
      setError("Passwords do not match");
      alert("Passwords do not match");
      return;
    }

    // Validate password length
    if (password.length < 8) {
      setLoading(false);
      setError("Password must be at least 8 characters");
      alert("Password must be at least 8 characters");
      return;
    }

    const response = await authApi.signup(email, password, name);

    setLoading(false);

    if (response.error) {
      setError(response.error);
      alert(`Signup failed: ${response.error}`);
    } else {
      // Auto-login after signup
      const loginResponse = await authApi.login(email, password);
      if (loginResponse.data) {
        authUtils.setToken(loginResponse.data.access_token);
        // Update profile with name from signup
        await profileApi.updateProfile({ full_name: name });
        // Cache for navbar
        localStorage.setItem("profile_cache", JSON.stringify({ full_name: name }));
        window.location.hash = "#/profile";
      } else {
        alert("Account created! Please log in.");
      }
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      alert("Please enter your email address");
      return;
    }

    setLoading(true);
    const response = await authApi.requestPasswordReset(resetEmail);
    setLoading(false);

    if (response.error) {
      alert(`Error: ${response.error}`);
    } else {
      setResetSent(true);

      // Reset after 5 seconds
      setTimeout(() => {
        setResetSent(false);
        setShowResetPassword(false);
        setResetEmail("");
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800 px-4 py-8 md:px-6 md:py-10">
      <div className="max-w-4xl mx-auto">
        <a
          href="#"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 text-sm"
        >
          ← Back to Home
        </a>

        {/* Password Reset Modal */}
        {showResetPassword && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Reset Password</h3>
                <button
                  onClick={() => setShowResetPassword(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              {!resetSent ? (
                <>
                  <p className="text-slate-600 mb-4">
                    Enter your email address and we'll send you a link to reset
                    your password.
                  </p>
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl ring-1 ring-slate-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowResetPassword(false)}
                        className="flex-1 px-4 py-3 rounded-xl ring-1 ring-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-medium"
                      >
                        Send Reset Link
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="text-green-500 text-4xl mb-4">✓</div>
                  <h4 className="text-lg font-semibold mb-2">
                    Reset Email Sent!
                  </h4>
                  <p className="text-slate-600">
                    We've sent a password reset link to{" "}
                    <strong>{resetEmail}</strong>. Please check your inbox and
                    follow the instructions.
                  </p>
                  <button
                    onClick={() => setShowResetPassword(false)}
                    className="mt-6 px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-medium"
                  >
                    Return to Login
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
            Sign in or create your account
          </h1>
          <p className="text-sm md:text-base text-slate-600 mt-2">
            Join the Projects Club community to collaborate and grow your skills.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {/* Login Form */}
          <div className="p-6 md:p-7 bg-white rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.06)] ring-1 ring-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-2xl text-slate-900">
                Login
              </h3>
              <span className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                Returning members
              </span>
            </div>
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  className="w-full px-4 py-3 rounded-xl ring-1 ring-slate-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  className="w-full px-4 py-3 rounded-xl ring-1 ring-slate-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowResetPassword(true)}
                  className="text-sm text-slate-500 hover:text-slate-800 hover:underline transition"
                >
                  Forgot your password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>

          {/* Signup Form */}
          <div className="p-6 md:p-7 bg-white rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.06)] ring-1 ring-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-2xl text-slate-900">
                Sign Up
              </h3>
              <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-700">
                New here
              </span>
            </div>
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  className="w-full px-4 py-3 rounded-xl ring-1 ring-slate-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="signup-email"
                  className="w-full px-4 py-3 rounded-xl ring-1 ring-slate-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="signup-password"
                  className="w-full px-4 py-3 rounded-xl ring-1 ring-slate-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="Create a password"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">
                  Must be at least 8 characters
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirm-password"
                  className="w-full px-4 py-3 rounded-xl ring-1 ring-slate-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="Confirm your password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
