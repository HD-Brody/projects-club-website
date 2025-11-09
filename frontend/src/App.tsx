import React, { useState, useEffect } from "react";
import EscapeRoomPage from "./EscapeRoom";

// ⬇️ Replace these with your real images (GitHub, Google Drive public links, or /public folder paths)
const GALLERY = [
  { src: "/HTFgroupPhoto.JPG", alt: "Hack The Future 2025" },
  { src: "/HTFworkshop.JPG", alt: "Workshop crowd" },
  { src: "/HTFpitch.JPG", alt: "Hack The Future Pitch" },
  { src: "/HTFspeaker.webp", alt: "Hack The Future Speaker" },
  { src: "/HTFjudges.JPG", alt: "Judge Panel" },
  { src: "/HTFrandomTeam.JPG", alt: "Team collaboration" }
];

// New page component - Login/Signup Page
function LoginSignupPage() {
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

export default function App() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [route, setRoute] = useState(window.location.hash || "");
  
  useEffect(() => {
    document.title = "Projects Club — University of Toronto";
    const onHash = () => setRoute(window.location.hash || "");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const openLightbox = (i: number) => {
    setActive(i);
    setOpen(true);
  };

  // Route handling for different pages
  if (route === '#/escape') {
    return <EscapeRoomPage />;
  }

  if (route === '#/login') {
    return <LoginSignupPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800">
      {/* Top Nav */}
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/70 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-slate-900 text-white grid place-items-center font-bold">PC</div>
            <div className="leading-tight">
              <p className="font-semibold">UofT Projects Club</p>
              <p className="text-xs text-slate-500">Bridge business × tech</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#about" className="hover:text-slate-900">About</a>
            <a href="#events" className="hover:text-slate-900">Events</a>
            <a href="#gallery" className="hover:text-slate-900">Photos</a>
            <a href="#sponsors" className="hover:text-slate-900">Sponsors</a>
            
            {/* UPDATED BUTTON - Now points to #/login */}
            <a 
              href="#/login" 
              className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Login/Signup
            </a>
            
            <a href="#join" className="px-3 py-1.5 rounded-full bg-slate-900 text-white hover:opacity-90">Join us</a>
            {/* Prominent Escape Room CTA (desktop) */}
            <a href="#/escape" aria-label="Open Escape Room registration" className="ml-3 inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-pink-500 text-white font-semibold shadow-2xl hover:scale-105 transform transition-all animate-pulse">
              <span className="text-lg">🧩</span>
              <span>Register: Escape Room</span>
            </a>
          </nav>
        </div>
      </header>
    
    {/* Floating mobile CTA: visible on small screens only */}
    <a href="#/escape" aria-label="Open Escape Room registration" className="fixed bottom-6 right-6 z-50 md:hidden bg-amber-500 text-white p-4 rounded-full shadow-2xl transform-gpu hover:scale-105 transition-transform animate-bounce grid place-items-center">🧩</a>

      {/* Rest of your existing home page content remains exactly the same */}
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-30" aria-hidden>
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-sky-200 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-indigo-200 blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-12 lg:pt-24 lg:pb-20 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
              Build real things. <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600">Together.</span>
            </h1>
            <p className="mt-5 text-lg text-slate-600 max-w-xl">
              Projects Club connects Rotman Commerce and CS students to ship portfolio‑worthy projects: hackathons, build nights, workshops, and industry collabs.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSf1h5CuLi0lXiUQ2n59tWM7Xn5aFbfAY4sThN-9O2dGlsBKqA/viewform" target="_blank" className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:opacity-90">Apply</a>
              <a href="https://discord.gg/EpgUyjtZm5" target="_blank" className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:opacity-90">Join our Discord <i className="fa-brands fa-discord"></i></a>
              <a href="#events" className="px-4 py-2 rounded-xl ring-1 ring-slate-300 hover:bg-white">Upcoming Events</a>
            </div>
            <div className="mt-6 flex items-center gap-6 text-sm text-slate-500">
              <div className="flex -space-x-2">
                {GALLERY.slice(0,4).map((g,i) => (
                  <img key={i} src={g.src} alt="" className="h-8 w-8 rounded-full ring-2 ring-white object-cover" />
                ))}
              </div>
              <span>150+ members · 30+ projects shipped</span>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-video rounded-2xl shadow-xl bg-white ring-1 ring-slate-200 overflow-hidden">
              <img src={GALLERY[0].src} alt="Club highlight" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold">What we do</h2>
            <p className="mt-2 text-slate-600">Hands‑on, interdisciplinary, resume‑ready.</p>
          </div>
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
            {[
              { title: "Hack Nights", desc: "Weekly build sessions with mentors and snacks."},
              { title: "Workshops", desc: "Git, product thinking, AI, cloud, and more."},
              { title: "Industry Collabs", desc: "Partner projects with companies and labs."},
              { title: "Showcases", desc: "Demo days to present and get feedback."}
            ].map((c,i) => (
              <div key={i} className="p-6 rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm">
                <h3 className="font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events preview */}
      <section id="events" className="py-14 bg-white ring-1 ring-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold">Recent events</h2>
              <p className="text-slate-600 mt-2">From hackathons to coffee chats with PMs and founders.</p>
            </div>
            <a href="#gallery" className="text-sm underline underline-offset-4">See all photos</a>
          </div>
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            {[0,1,2].map((i) => (
              <article key={i} className="group overflow-hidden rounded-2xl ring-1 ring-slate-200 bg-slate-50 hover:bg-white transition shadow-sm">
                <div className="aspect-video overflow-hidden">
                  <img src={GALLERY[i+1].src} alt={GALLERY[i+1].alt} className="h-full w-full object-cover group-hover:scale-105 transition" />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold">{["Build Night: AI Agents","Speaker: Product x AI","Mini Hackathon Finals"][i]}</h3>
                  <p className="mt-1 text-sm text-slate-600 line-clamp-2">{["Rapid prototyping with mentors.","Fireside chat + Q&A.","Top 10 teams demo at Google Canada."][i]}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section id="gallery" className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold">Photos from past events</h2>
          <p className="text-slate-600 mt-2">Tap any photo to view larger. Add more by editing the <code>GALLERY</code> array.</p>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {GALLERY.map((g, i) => (
              <button key={i} className="relative group focus:outline-none" onClick={() => openLightbox(i)}>
                <img src={g.src} alt={g.alt} className="h-40 md:h-48 w-full object-cover rounded-xl ring-1 ring-slate-200 shadow-sm group-hover:opacity-90"/>
                <span className="sr-only">Open photo {i+1}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsors */}
      <section id="sponsors" className="py-14 bg-white ring-1 ring-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold">Sponsors & Partners</h2>
          <p className="text-slate-600 mt-2">Thank you to our supporters.</p>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Google","eBay","Walmart","Microsoft"].map((name) => (
              <div key={name} className="h-20 rounded-xl ring-1 ring-slate-200 grid place-items-center bg-slate-50 text-slate-600 font-medium">
                <div className="h-20 w-40 flex items-center justify-center p-4">
                <img
                  src={`/${name.toLowerCase()}-logo.png`}
                  alt={name}
                  className="max-h-12"
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    img.replaceWith(name);
                  }}
                />  
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Escape Room Registration */}
      <section id="escape-room" className="py-14 bg-slate-50 ring-1 ring-slate-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold">Escape Room — Registration</h2>
          <p className="text-slate-600 mt-2">Sign up for the Escape Room event.</p>
          <div className="mt-6">
            <a href="#/escape" className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:opacity-90">Open registration page</a>
          </div>
        </div>
      </section>

      {/* Join Us */}
      <section id="join" className="py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold">Join Projects Club</h2>
          <p className="text-slate-600 mt-3">
            We welcome builders, designers, and business minds. No experience required—just curiosity and commitment.
          </p>
          <form className="mt-8 grid sm:grid-cols-[1fr_auto] gap-3 max-w-xl mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input type="email" required placeholder="Email address" className="px-4 py-3 rounded-xl ring-1 ring-slate-300 bg-white focus:ring-2 focus:ring-slate-900 outline-none" />
            <button type="submit" className="px-5 py-3 rounded-xl bg-slate-900 text-white hover:opacity-90">Get updates</button>
          </form>
          <p className="text-xs text-slate-500 mt-3">Or email us: <a href="mailto:projectsclub@utoronto.ca">projectsclub@utoronto.ca</a></p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-sm flex flex-col md:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Projects Club, University of Toronto</p>
          <div className="flex items-center gap-4">
            <a href="https://discord.gg/EpgUyjtZm5" target="_blank">
              <span><i className="fa-brands fa-discord"></i> </span>
              <span className="underline underline-offset-4">Discord</span>
            </a>
            <a href="https://www.instagram.com/ut_projects" target="_blank">
              <span><i className="fa-brands fa-instagram"></i> </span>
              <span className="underline underline-offset-4">Instagram</span>
            </a>
            <a href="https://www.linkedin.com/company/uoft-project-club" target="_blank">
              <span><i className="fa-brands fa-linkedin"></i> </span>
              <span className="underline underline-offset-4">LinkedIn</span>
            </a>
            <a href="mailto:projectsclub@utoronto.ca">
              <span><i className="fa-solid fa-envelope"></i> </span>
              <span className="underline underline-offset-4">Email</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Lightbox */}
      {open && (
        <div role="dialog" aria-modal className="fixed inset-0 z-[60] bg-black/70 grid place-items-center p-4" onClick={() => setOpen(false)}>
          <div className="relative max-w-5xl w-full" onClick={e => e.stopPropagation()}>
            <img src={GALLERY[active].src} alt={GALLERY[active].alt} className="w-full h-auto rounded-2xl shadow-2xl" />
            <button onClick={() => setOpen(false)} className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 ring-1 ring-slate-300 grid place-items-center">✕</button>
            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2">
              <button aria-label="Prev" onClick={() => setActive((active - 1 + GALLERY.length) % GALLERY.length)} className="h-10 w-10 rounded-full bg-white/90 ring-1 ring-slate-300 grid place-items-center">‹</button>
              <button aria-label="Next" onClick={() => setActive((active + 1) % GALLERY.length)} className="h-10 w-10 rounded-full bg-white/90 ring-1 ring-slate-300 grid place-items-center">›</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}