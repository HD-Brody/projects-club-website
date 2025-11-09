import React, { useState } from "react";

export default function LoginSignupPage() {
  const [profileData, setProfileData] = useState({
    description: "",
    skills: ""
  });

  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert("Please sign in to save your profile!");
      return;
    }
    // Here you would typically send the data to your backend
    console.log("Profile data:", profileData);
    alert("Profile saved successfully!");
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    
    // Simulate successful login
    setIsLoggedIn(true);
    setUserEmail(email);
    alert(`Successfully logged in as ${email}`);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('signup-email') as string;
    
    // Simulate successful signup and auto-login
    setIsLoggedIn(true);
    setUserEmail(email);
    alert(`Account created successfully! Logged in as ${email}`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail("");
    setProfileData({ description: "", skills: "" });
    alert("Successfully logged out!");
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      alert("Please enter your email address");
      return;
    }
    
    // Simulate sending reset email
    console.log("Sending reset email to:", resetEmail);
    setResetSent(true);
    
    // Reset after 5 seconds
    setTimeout(() => {
      setResetSent(false);
      setShowResetPassword(false);
      setResetEmail("");
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800 p-8">
      <div className="max-w-4xl mx-auto">
        <a href="#" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8">
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
                <p className="text-sm text-green-600">You can now access all features</p>
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

        <h1 className="text-4xl font-bold mb-6">
          {isLoggedIn ? "Welcome Back!" : "Login/Signup"}
        </h1>
        <p className="text-lg text-slate-600 mb-8">
          {isLoggedIn 
            ? "Manage your account and build your professional profile."
            : "Welcome to Projects Club! Sign in to your account or create a new one to get started."
          }
        </p>
        
        {!isLoggedIn ? (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Login Form */}
            <div className="p-8 bg-white rounded-2xl shadow-sm ring-1 ring-slate-200">
              <h3 className="font-semibold text-2xl mb-6">Login</h3>
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    className="w-full px-4 py-3 rounded-xl ring-1 ring-slate-300 bg-white focus:ring-2 focus:ring-slate-900 outline-none"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                  <input 
                    type="password" 
                    name="password"
                    className="w-full px-4 py-3 rounded-xl ring-1 ring-slate-300 bg-white focus:ring-2 focus:ring-slate-900 outline-none"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                
                {/* Forgot Password Link */}
                <div className="text-right">
                  <button 
                    type="button"
                    onClick={() => setShowResetPassword(true)}
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Forgot your password?
                  </button>
                </div>
                
                <button 
                  type="submit" 
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 text-white hover:opacity-90 font-medium"
                >
                  Sign In
                </button>
              </form>
            </div>

            {/* Signup Form */}
            <div className="p-8 bg-white rounded-2xl shadow-sm ring-1 ring-slate-200">
              <h3 className="font-semibold text-2xl mb-6">Sign Up</h3>
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    className="w-full px-4 py-3 rounded-xl ring-1 ring-slate-300 bg-white focus:ring-2 focus:ring-slate-900 outline-none"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    name="signup-email"
                    className="w-full px-4 py-3 rounded-xl ring-1 ring-slate-300 bg-white focus:ring-2 focus:ring-slate-900 outline-none"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                  <input 
                    type="password" 
                    name="signup-password"
                    className="w-full px-4 py-3 rounded-xl ring-1 ring-slate-300 bg-white focus:ring-2 focus:ring-slate-900 outline-none"
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
                    className="w-full px-4 py-3 rounded-xl ring-1 ring-slate-300 bg-white focus:ring-2 focus:ring-slate-900 outline-none"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
                
                {/* Terms Agreement */}
                <div className="flex items-start gap-3 text-sm">
                  <input 
                    type="checkbox" 
                    id="terms"
                    className="mt-1 rounded ring-1 ring-slate-300"
                    required
                  />
                  <label htmlFor="terms" className="text-slate-600">
                    I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                  </label>
                </div>
                
                <button 
                  type="submit" 
                  className="w-full px-4 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-medium"
                >
                  Create Account
                </button>
              </form>
            </div>
          </div>
        ) : null}

        {/* Additional Features Section */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          {/* Profile Builder Feature - Locked until login */}
          <div className={`p-6 rounded-2xl shadow-sm ring-1 ${
            isLoggedIn 
              ? "bg-white ring-slate-200" 
              : "bg-slate-100 ring-slate-300 opacity-75"
          }`}>
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-lg">Profile Builder</h3>
              {!isLoggedIn && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full font-medium">
                  🔒 Sign in required
                </span>
              )}
            </div>
            <p className="text-slate-600 mb-4">
              {isLoggedIn 
                ? "Create your professional profile to showcase your skills and connect with team members."
                : "Sign in to create your professional profile and showcase your skills to other members."
              }
            </p>
            
            {isLoggedIn ? (
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                  <textarea 
                    value={profileData.description}
                    onChange={(e) => setProfileData({...profileData, description: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl ring-1 ring-slate-300 bg-white focus:ring-2 focus:ring-slate-900 outline-none resize-none"
                    placeholder="Tell us about yourself, your interests, and what you're looking for..."
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Skills</label>
                  <textarea 
                    value={profileData.skills}
                    onChange={(e) => setProfileData({...profileData, skills: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl ring-1 ring-slate-300 bg-white focus:ring-2 focus:ring-slate-900 outline-none resize-none"
                    placeholder="List your technical skills, soft skills, and areas of expertise..."
                    rows={2}
                  />
                  <p className="text-xs text-slate-500 mt-1">Separate skills with commas (e.g., JavaScript, Python, UI/UX Design, Project Management)</p>
                </div>
                <button 
                  type="submit" 
                  className="px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 font-medium"
                >
                  Save Profile
                </button>
              </form>
            ) : (
              <div className="text-center py-6">
                <div className="text-4xl mb-3">🔐</div>
                <p className="text-slate-600 mb-4">Please sign in to access the Profile Builder</p>
                <button 
                  onClick={() => window.scrollTo(0, 0)}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-medium"
                >
                  Go to Login
                </button>
              </div>
            )}
          </div>
          
          <div className="p-6 bg-white rounded-2xl shadow-sm ring-1 ring-slate-200">
            <h3 className="font-semibold text-lg mb-3">Event Registration</h3>
            <p className="text-slate-600">
              {isLoggedIn 
                ? "Sign up for upcoming workshops, hackathons, and networking events with your account."
                : "Browse and register for upcoming workshops, hackathons, and networking events."
              }
            </p>
            {isLoggedIn && (
              <button className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-medium">
                Browse Events
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
