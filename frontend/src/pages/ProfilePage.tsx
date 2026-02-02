import React, { useState, useEffect } from "react";
import { profileApi, authUtils } from "../utils/api";

export default function ProfilePage() {
  const [profileData, setProfileData] = useState({
    full_name: "",
    program: "",
    year: "",
    bio: "",
    skills: "",
    linkedin: "",
    discord: "",
    instagram: ""
  });

  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const skillsList = profileData.skills
    ? profileData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
    : [];

  const initials = (profileData.full_name || userEmail || "")
    .split(" ")
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
      setProfileData((prev) => {
        const profile = {
          full_name: response.data.full_name || prev.full_name || "",
          program: response.data.program || prev.program || "",
          year: response.data.year || prev.year || "",
          bio: response.data.bio || prev.bio || "",
          skills: response.data.skills || prev.skills || "",
          linkedin: response.data.linkedin || prev.linkedin || "",
          discord: response.data.discord || prev.discord || "",
          instagram: response.data.instagram || prev.instagram || ""
        };
        localStorage.setItem("profile_cache", JSON.stringify(profile));
        return profile;
      });
      setUserEmail(response.data.email || "");
    }
  };

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = authUtils.getToken();
    if (token) {
      loadProfile();
    } else {
      // Redirect to login if not authenticated
      window.location.hash = "#/login";
    }
  }, []);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

  const handleLogout = () => {
    authUtils.removeToken();
    localStorage.removeItem("profile_cache");
    alert("Successfully logged out!");
    window.location.hash = "#/login";
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

        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
            Welcome Back!
          </h1>
          <p className="text-sm md:text-base text-slate-600 mt-2">
            Manage your account and build your professional profile.
          </p>
        </div>

        <div className="mt-6">
          {profileLoading ? (
            <p className="text-slate-400 py-8">Loading...</p>
          ) : (
            <>
              {/* Identity row with layered accent */}
              <div className="relative mb-10">
                <div className="absolute -left-4 top-6 h-12 w-12 bg-sky-200 rounded-full blur-2xl opacity-60" aria-hidden />
                <div className="flex gap-6 items-center relative">
                  <div className="h-28 w-28 shrink-0 rounded-full bg-gradient-to-br from-sky-600 to-indigo-600 text-white font-bold grid place-items-center text-4xl uppercase shadow-[0_10px_30px_rgba(59,130,246,0.35)]">
                    {initials || "U"}
                  </div>
                  <div className="min-w-0 pt-1">
                    <h2 className="text-3xl font-bold text-slate-900 mt-1 truncate">
                      {profileData.full_name || "Your Name"}
                    </h2>
                    <p className="text-slate-500 mt-1">
                      {profileData.program && profileData.year
                        ? `${profileData.program} · ${profileData.year}`
                        : profileData.program || profileData.year || ""}
                    </p>
                    <div className="flex items-center gap-2 mt-3 text-sm text-slate-500">
                      <span className="h-2 w-2 rounded-full bg-sky-400" />
                      <span>{userEmail}</span>
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="ml-3 text-slate-400 hover:text-slate-700 transition"
                      >
                        Edit profile →
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-6 max-w-3xl">
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">About</h3>
                  <p className="text-slate-800 leading-relaxed bg-white rounded-xl px-5 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)] border border-slate-100">
                    {profileData.bio?.trim() || <span className="text-slate-300">No bio yet</span>}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                    <span className="h-2 w-2 rounded-full bg-sky-400" />
                    <span>Skills</span>
                  </div>
                  {skillsList.length ? (
                    <div className="flex flex-wrap gap-2">
                      {skillsList.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1.5 rounded-full bg-sky-50 text-sky-800 text-xs font-semibold shadow-sm border border-sky-100"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-300">No skills listed</span>
                  )}
                </div>

                {/* Socials Section */}
                {(profileData.linkedin || profileData.discord || profileData.instagram) && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                      <span className="h-2 w-2 rounded-full bg-indigo-400" />
                      <span>Socials</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {profileData.linkedin && (
                        <a
                          href={profileData.linkedin.startsWith('http') ? profileData.linkedin : `https://${profileData.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0077B5]/10 text-[#0077B5] hover:bg-[#0077B5]/20 transition text-sm font-medium"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                          LinkedIn
                        </a>
                      )}
                      {profileData.discord && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#5865F2]/10 text-[#5865F2] text-sm font-medium">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                          </svg>
                          {profileData.discord}
                        </div>
                      )}
                      {profileData.instagram && (
                        <a
                          href={profileData.instagram.startsWith('http') ? profileData.instagram : `https://instagram.com/${profileData.instagram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#833AB4]/10 via-[#E1306C]/10 to-[#F77737]/10 text-[#E1306C] hover:from-[#833AB4]/20 hover:via-[#E1306C]/20 hover:to-[#F77737]/20 transition text-sm font-medium"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                          </svg>
                          Instagram
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Edit form */}
              {isEditing && (
                <div className="mt-10 p-6 bg-white rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.08)] ring-1 ring-slate-100">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="font-semibold text-lg text-slate-900">Edit Profile</h3>
                      <p className="text-sm text-slate-500">Keep it concise and clear.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="text-sm text-slate-400 hover:text-slate-700"
                    >
                      Cancel
                    </button>
                  </div>

                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-slate-700 mb-1.5">Name</label>
                        <input
                          type="text"
                          value={profileData.full_name}
                          onChange={(e) =>
                            setProfileData({ ...profileData, full_name: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 outline-none text-sm"
                          placeholder="Your name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-700 mb-1.5">Program</label>
                        <input
                          type="text"
                          value={profileData.program}
                          onChange={(e) =>
                            setProfileData({ ...profileData, program: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 outline-none text-sm"
                          placeholder="e.g., Rotman Commerce"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-slate-700 mb-1.5">Year</label>
                      <select
                        value={profileData.year}
                        onChange={(e) =>
                          setProfileData({ ...profileData, year: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 outline-none text-sm"
                        required
                      >
                        <option value="">Select year</option>
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                        <option value="Graduate">Graduate</option>
                        <option value="Alumni">Alumni</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-slate-700 mb-1.5">Bio</label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) =>
                          setProfileData({ ...profileData, bio: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 outline-none text-sm resize-none"
                        placeholder="A few words about yourself"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-slate-700 mb-1.5">Skills</label>
                      <input
                        type="text"
                        value={profileData.skills}
                        onChange={(e) =>
                          setProfileData({ ...profileData, skills: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 outline-none text-sm"
                        placeholder="Python, React, Design..."
                      />
                    </div>

                    {/* Social Media Fields */}
                    <div className="pt-2">
                      <label className="block text-sm text-slate-700 mb-3">Socials <span className="text-slate-400">(optional)</span></label>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs text-slate-500 mb-1.5">LinkedIn</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0077B5]">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                              </svg>
                            </span>
                            <input
                              type="text"
                              value={profileData.linkedin}
                              onChange={(e) =>
                                setProfileData({ ...profileData, linkedin: e.target.value })
                              }
                              className="w-full pl-10 pr-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 outline-none text-sm"
                              placeholder="linkedin.com/in/username"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-1.5">Discord</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5865F2]">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                              </svg>
                            </span>
                            <input
                              type="text"
                              value={profileData.discord}
                              onChange={(e) =>
                                setProfileData({ ...profileData, discord: e.target.value })
                              }
                              className="w-full pl-10 pr-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 outline-none text-sm"
                              placeholder="username"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-1.5">Instagram</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#E1306C]">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                              </svg>
                            </span>
                            <input
                              type="text"
                              value={profileData.instagram}
                              onChange={(e) =>
                                setProfileData({ ...profileData, instagram: e.target.value })
                              }
                              className="w-full pl-10 pr-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 outline-none text-sm"
                              placeholder="@username"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 text-sm font-medium transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-sm font-semibold disabled:opacity-50"
                      >
                        {loading ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
