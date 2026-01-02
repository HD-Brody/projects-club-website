import React, { useState, useEffect } from "react";
import { authApi, profileApi, authUtils } from "../utils/api";

export default function LoginSignupPage() {
  const [profileData, setProfileData] = useState({
    full_name: "",
    program: "",
    year: "",
    bio: "",
    skills: ""
  });

  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const skillsList = profileData.skills
    ? profileData.skills.split(",").map((skill) => skill.trim()).filter(Boolean)
    : [];

  const initials = (profileData.full_name || userEmail || "").split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .join("")
    .slice(0, 2);

  // Load profile when user logs in
  const loadProfile = async () => {
    setProfileLoading(true);
    const response = await profileApi.getProfile();
    setProfileLoading(false);

    if (response.data) {
      const profile = {
        full_name: response.data.full_name || "",
        program: response.data.program || "",
        year: response.data.year || "",
        bio: response.data.bio || "",
        skills: response.data.skills || ""
      };
      setProfileData(profile);
      setUserEmail(response.data.email || "");
      // Cache for navbar avatar
      localStorage.setItem("profile_cache", JSON.stringify(profile));
    }
  };

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = authUtils.getToken();
    if (token) {
      setIsLoggedIn(true);
      loadProfile();
    }
  }, []);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert("Please sign in to save your profile!");
      return;
    }

    setLoading(true);
    const response = await profileApi.updateProfile(profileData);
    setLoading(false);

    if (response.error) {
      setError(response.error);
      alert(`Error: ${response.error}`);
    } else {
      alert("Profile saved successfully!");
      setIsEditing(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const response = await authApi.login(email, password);

    setLoading(false);

    if (response.error) {
      setError(response.error);
      alert(`Login failed: ${response.error}`);
    } else if (response.data) {
      // Store token and update UI
      authUtils.setToken(response.data.access_token);
      setIsLoggedIn(true);
      setUserEmail(email);
      loadProfile(); // Load profile after login
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    const email = formData.get('signup-email') as string;
    const password = formData.get('signup-password') as string;
    const confirmPassword = formData.get('confirm-password') as string;

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
        setIsLoggedIn(true);
        setUserEmail(email);
        loadProfile(); // Load profile after signup
      } else {
        alert("Account created! Please log in.");
      }
    }
  };

  const handleLogout = () => {
    authUtils.removeToken();
    localStorage.removeItem("profile_cache");
    setIsLoggedIn(false);
    setUserEmail("");
    setIsEditing(false);
    setProfileData({
      full_name: "",
      program: "",
      year: "",
      bio: "",
      skills: ""
    });
    alert("Successfully logged out!");
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
        <a href="#" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 text-sm">
          ← Back to Home
        </a>
        
        {/* User Status Bar */}
        {isLoggedIn && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-green-500 text-white grid place-items-center">
                ✓
              </div>
              <div>
                <p className="font-medium text-green-800">Signed in as {userEmail}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 font-medium"
            >
              Logout
            </button>
          </div>
        )}
        
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
                    Enter your email address and we'll send you a link to reset your password.
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
                  <h4 className="text-lg font-semibold mb-2">Reset Email Sent!</h4>
                  <p className="text-slate-600">
                    We've sent a password reset link to <strong>{resetEmail}</strong>. 
                    Please check your inbox and follow the instructions.
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
            {isLoggedIn ? "Welcome Back!" : "Sign in or create your account"}
          </h1>
          <p className="text-sm md:text-base text-slate-600 mt-2">
            {isLoggedIn 
              ? "Manage your account and build your professional profile."
              : "Join the Projects Club community to collaborate and grow your skills."
            }
          </p>
        </div>
        
        {!isLoggedIn ? (
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            {/* Login Form */}
            <div className="p-6 md:p-7 bg-white rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.06)] ring-1 ring-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-2xl text-slate-900">Login</h3>
                <span className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-600">Returning members</span>
              </div>
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    className="w-full px-4 py-3 rounded-xl ring-1 ring-slate-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
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
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
            </div>

            {/* Signup Form */}
            <div className="p-6 md:p-7 bg-white rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.06)] ring-1 ring-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-2xl text-slate-900">Sign Up</h3>
                <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-700">New here</span>
              </div>
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    className="w-full px-4 py-3 rounded-xl ring-1 ring-slate-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    name="signup-email"
                    className="w-full px-4 py-3 rounded-xl ring-1 ring-slate-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                  <input 
                    type="password" 
                    name="signup-password"
                    className="w-full px-4 py-3 rounded-xl ring-1 ring-slate-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                    placeholder="Create a password"
                    required
                  />
                  <p className="text-xs text-slate-500 mt-1">Must be at least 8 characters</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
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
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            </div>
          </div>
        ) : null}

        {/* Profile Editor - shown when logged in */}
        {isLoggedIn && (
          <div className="mt-10 space-y-4">
            {profileLoading ? (
              <div className="p-8 bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 text-center">
                <p className="text-slate-500">Loading profile...</p>
              </div>
            ) : (
              <>
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-5">
                    <div className="h-16 w-16 rounded-full bg-blue-100 text-blue-700 font-semibold grid place-items-center text-xl uppercase">
                      {initials || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl font-bold text-slate-900 truncate">{profileData.full_name || "Your Name"}</h2>
                      <p className="text-slate-600 mt-0.5">
                        {profileData.program && profileData.year 
                          ? `${profileData.program} · ${profileData.year}`
                          : profileData.program || profileData.year || "Add your program and year"}
                      </p>
                      <p className="text-sm text-slate-500">{userEmail}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-sm transition"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-6 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 h-full flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.12em] text-slate-500">About</p>
                        <h3 className="text-lg font-semibold text-slate-900">Your story</h3>
                      </div>
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      {profileData.bio?.trim() ? profileData.bio : "Add a short bio so members can get to know you."}
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 h-full flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Skills</p>
                        <h3 className="text-lg font-semibold text-slate-900">What you bring</h3>
                      </div>
                    </div>
                    {skillsList.length ? (
                      <div className="flex flex-wrap gap-2">
                        {skillsList.map((skill) => (
                          <span key={skill} className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500">No skills listed yet.</p>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="p-8 bg-white rounded-2xl shadow-[0_12px_40px_rgba(15,23,42,0.08)] ring-1 ring-slate-200">
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div>
                        <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Edit mode</p>
                        <h3 className="text-xl font-semibold text-slate-900">Update your details</h3>
                        <p className="text-slate-600 text-sm mt-1">Keep your profile current so members know how to collaborate with you.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="text-sm text-slate-500 hover:text-slate-800"
                      >
                        Cancel
                      </button>
                    </div>
                    <form onSubmit={handleProfileSubmit} className="space-y-8">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Basic Info</p>
                          <h3 className="text-lg font-semibold text-slate-900 mt-1">Who you are</h3>
                        </div>
                        <div className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">Required</div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={profileData.full_name}
                            onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl ring-1 ring-slate-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="John Doe"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Program <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={profileData.program}
                            onChange={(e) => setProfileData({ ...profileData, program: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl ring-1 ring-slate-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Computer Science"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Year <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={profileData.year}
                          onChange={(e) => setProfileData({ ...profileData, year: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl ring-1 ring-slate-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                          required
                        >
                          <option value="">Select your year</option>
                          <option value="1st Year">1st Year</option>
                          <option value="2nd Year">2nd Year</option>
                          <option value="3rd Year">3rd Year</option>
                          <option value="4th Year">4th Year</option>
                          <option value="Graduate">Graduate</option>
                          <option value="Alumni">Alumni</option>
                        </select>
                      </div>

                      <div className="border-t border-slate-200 pt-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">About You</p>
                            <h3 className="text-lg font-semibold text-slate-900 mt-1">Share a bit of your story</h3>
                          </div>
                          <div className="text-xs text-slate-500">Visible to club members</div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Bio
                          </label>
                          <textarea
                            value={profileData.bio}
                            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl ring-1 ring-slate-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            placeholder="Tell us about yourself, your interests, and what you're passionate about..."
                            rows={4}
                          />
                          <p className="text-xs text-slate-500 mt-1">
                            A brief introduction about yourself
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-slate-200 pt-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Skills</p>
                            <h3 className="text-lg font-semibold text-slate-900 mt-1">What you work with</h3>
                          </div>
                          <div className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">Helps matching</div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Skills
                          </label>
                          <input
                            type="text"
                            value={profileData.skills}
                            onChange={(e) => setProfileData({ ...profileData, skills: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl ring-1 ring-slate-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Python, JavaScript, React, Flask, UI/UX Design..."
                          />
                          <p className="text-xs text-slate-500 mt-1">
                            Comma-separated list of your technical skills
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? 'Saving...' : 'Save Profile'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
