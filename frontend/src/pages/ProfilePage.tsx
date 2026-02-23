import React, { useState, useEffect, useRef } from "react";
import { profileApi, authUtils, API_BASE_URL } from "../utils/api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProjectsSection from "../components/ProjectsSection";

interface ProfilePageProps {
  viewUserId?: number;
}

export default function ProfilePage({ viewUserId }: ProfilePageProps) {
  const isPublicView = viewUserId !== undefined;
  const [profileData, setProfileData] = useState({
    full_name: "",
    program: "",
    year: "",
    bio: "",
    skills: "",
    linkedin: "",
    discord: "",
    instagram: "",
    resume_filename: ""
  });

  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          instagram: response.data.instagram || prev.instagram || "",
          resume_filename: response.data.resume_filename || ""
        };
        localStorage.setItem("profile_cache", JSON.stringify(profile));
        return profile;
      });
      setUserEmail(response.data.email || "");
    }
  };

  // Load a public profile by user ID
  const loadPublicProfile = async (userId: number) => {
    setProfileLoading(true);
    const response = await profileApi.getPublicProfile(userId);
    setProfileLoading(false);

    if (response.error) {
      setError(response.error);
    } else if (response.data) {
      setProfileData({
        full_name: response.data.full_name || "",
        program: response.data.program || "",
        year: response.data.year || "",
        bio: response.data.bio || "",
        skills: response.data.skills || "",
        linkedin: response.data.linkedin || "",
        discord: response.data.discord || "",
        instagram: response.data.instagram || "",
        resume_filename: ""
      });
    }
  };

  // Check if user is already logged in on mount
  useEffect(() => {
    if (isPublicView) {
      loadPublicProfile(viewUserId);
    } else {
      const token = authUtils.getToken();
      if (token) {
        loadProfile();
      } else {
        window.location.hash = "#/login";
      }
    }
  }, [viewUserId]);

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

  // Resume upload handlers
  const handleResumeUpload = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      alert('Only PDF files are allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setResumeUploading(true);
    const response = await profileApi.uploadResume(file);
    setResumeUploading(false);

    if (response.error) {
      alert(`Error: ${response.error}`);
    } else {
      setProfileData(prev => ({ ...prev, resume_filename: response.data.resume_filename }));
      alert('Resume uploaded successfully!');
    }
  };

  const handleResumeDelete = async () => {
    if (!confirm('Are you sure you want to delete your resume?')) return;

    const response = await profileApi.deleteResume();
    if (response.error) {
      alert(`Error: ${response.error}`);
    } else {
      setProfileData(prev => ({ ...prev, resume_filename: '' }));
      alert('Resume deleted successfully!');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleResumeUpload(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleResumeUpload(file);
  };

  const fetchResumeBlob = async () => {
    const token = authUtils.getToken();
    const response = await fetch(`${API_BASE_URL}/api/profile/resume`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch resume');
    return response.blob();
  };

  const openResume = async () => {
    try {
      const blob = await fetchResumeBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      alert('Failed to open resume');
    }
  };

  const downloadResume = async () => {
    try {
      const blob = await fetchResumeBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = profileData.resume_filename || 'resume.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to download resume');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800">
      <Header />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <a
          href="#"
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 mb-8 text-sm transition"
        >
          ← Home
        </a>

        {profileLoading ? (
          <div className="py-20 text-center text-slate-400">Loading profile...</div>
        ) : error && isPublicView ? (
          <div className="py-20 text-center text-slate-400">{error}</div>
        ) : isEditing && !isPublicView ? (
          /* ────────────────── EDIT MODE ────────────────── */
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900">Edit Profile</h1>
              <p className="text-sm text-slate-500 mt-1">Update your information. Keep it concise.</p>
            </div>

            <form onSubmit={handleProfileSubmit}>
              {/* Section: Identity */}
              <div className="bg-white rounded-2xl ring-1 ring-slate-200 p-6 mb-4">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Identity</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-700 mb-1.5">Name</label>
                    <input
                      type="text"
                      value={profileData.full_name}
                      onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
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
                      onChange={(e) => setProfileData({ ...profileData, program: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 outline-none text-sm"
                      placeholder="e.g., Rotman Commerce"
                      required
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm text-slate-700 mb-1.5">Year</label>
                  <select
                    value={profileData.year}
                    onChange={(e) => setProfileData({ ...profileData, year: e.target.value })}
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
              </div>

              {/* Section: About */}
              <div className="bg-white rounded-2xl ring-1 ring-slate-200 p-6 mb-4">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">About</h3>
                <div>
                  <label className="block text-sm text-slate-700 mb-1.5">Bio</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 outline-none text-sm resize-none"
                    placeholder="A few words about yourself"
                    rows={3}
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm text-slate-700 mb-1.5">Skills</label>
                  <input
                    type="text"
                    value={profileData.skills}
                    onChange={(e) => setProfileData({ ...profileData, skills: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 outline-none text-sm"
                    placeholder="Python, React, Design... (comma-separated)"
                  />
                </div>
              </div>

              {/* Section: Socials */}
              <div className="bg-white rounded-2xl ring-1 ring-slate-200 p-6 mb-4">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Socials</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1.5">LinkedIn</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0077B5]">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      </span>
                      <input type="text" value={profileData.linkedin} onChange={(e) => setProfileData({ ...profileData, linkedin: e.target.value })} className="w-full pl-10 pr-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 outline-none text-sm" placeholder="linkedin.com/in/..." />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1.5">Discord</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5865F2]">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>
                      </span>
                      <input type="text" value={profileData.discord} onChange={(e) => setProfileData({ ...profileData, discord: e.target.value })} className="w-full pl-10 pr-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 outline-none text-sm" placeholder="username" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1.5">Instagram</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#E1306C]">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                      </span>
                      <input type="text" value={profileData.instagram} onChange={(e) => setProfileData({ ...profileData, instagram: e.target.value })} className="w-full pl-10 pr-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 outline-none text-sm" placeholder="@username" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Resume */}
              <div className="bg-white rounded-2xl ring-1 ring-slate-200 p-6 mb-6">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Resume</h3>
                <div>
                  {profileData.resume_filename ? (
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-slate-500" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zm-3 9h6v2h-6v-2zm0 4h6v2h-6v-2zm0-8h2v2h-2V9z"/></svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{profileData.resume_filename}</p>
                        <p className="text-xs text-slate-400">PDF Document</p>
                      </div>
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition text-sm">Replace</button>
                      <button type="button" onClick={handleResumeDelete} className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition text-sm">Delete</button>
                    </div>
                  ) : (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative p-6 border-2 border-dashed rounded-xl cursor-pointer transition ${isDragging ? 'border-sky-400 bg-sky-50' : 'border-slate-200 hover:border-slate-300 bg-slate-50'}`}
                    >
                      <div className="flex flex-col items-center gap-2 text-center">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${isDragging ? 'bg-sky-100' : 'bg-slate-100'}`}>
                          <svg className={`w-6 h-6 ${isDragging ? 'text-sky-500' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                        </div>
                        <p className="text-sm font-medium text-slate-700">{resumeUploading ? 'Uploading...' : 'Drop your resume here or click to browse'}</p>
                        <p className="text-xs text-slate-400">PDF only, max 5MB</p>
                      </div>
                    </div>
                  )}
                  <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileSelect} className="hidden" />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button type="button" onClick={() => setIsEditing(false)} className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-white hover:ring-1 hover:ring-slate-200 text-sm font-medium transition">Cancel</button>
                <button type="submit" disabled={loading} className="px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-sm font-semibold disabled:opacity-50 transition">
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* ────────────────── VIEW MODE ────────────────── */
          <div className="grid lg:grid-cols-[280px_1fr] gap-8">
            {/* ── Sidebar: Identity Card ── */}
            <aside className="space-y-5">
              <div className="bg-white rounded-2xl ring-1 ring-slate-200 p-6">
                {/* Avatar */}
                <div className="h-28 w-28 rounded-full bg-slate-900 text-white font-bold grid place-items-center text-3xl uppercase mx-auto ring-4 ring-slate-100">
                  {initials || "U"}
                </div>

                {/* Name & metadata */}
                <div className="mt-4 text-center">
                  <h1 className="text-lg font-bold text-slate-900 leading-snug">
                    {profileData.full_name || <span className="text-slate-400 font-normal text-base">No name set</span>}
                  </h1>
                  <p className="text-sm text-slate-500 mt-0.5">{!isPublicView && userEmail}</p>
                  {(profileData.program || profileData.year) && (
                    <p className="text-xs text-slate-500 mt-2 bg-slate-50 rounded-lg py-1.5 px-3 inline-block">
                      {profileData.program && profileData.year
                        ? `${profileData.program} · ${profileData.year}`
                        : profileData.program || profileData.year}
                    </p>
                  )}
                </div>

                {/* Actions — own profile only */}
                {!isPublicView && (
                <div className="mt-5 pt-5 border-t border-slate-100 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="w-full py-2 rounded-xl ring-1 ring-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full py-2 rounded-xl text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 transition"
                  >
                    Log out
                  </button>
                </div>
                )}
              </div>

              {/* Socials Card */}
              {(profileData.linkedin || profileData.discord || profileData.instagram) && (
                <div className="bg-white rounded-2xl ring-1 ring-slate-200 p-5">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Links</h3>
                  <div className="space-y-2">
                    {profileData.linkedin && (
                      <a
                        href={profileData.linkedin.startsWith('http') ? profileData.linkedin : `https://${profileData.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 py-1.5 text-sm text-slate-700 hover:text-slate-900 transition"
                      >
                        <svg className="w-4 h-4 text-[#0077B5] shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                        LinkedIn
                      </a>
                    )}
                    {profileData.discord && (
                      <span className="flex items-center gap-2.5 py-1.5 text-sm text-slate-700">
                        <svg className="w-4 h-4 text-[#5865F2] shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>
                        {profileData.discord}
                      </span>
                    )}
                    {profileData.instagram && (
                      <a
                        href={profileData.instagram.startsWith('http') ? profileData.instagram : `https://instagram.com/${profileData.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 py-1.5 text-sm text-slate-700 hover:text-slate-900 transition"
                      >
                        <svg className="w-4 h-4 text-[#E1306C] shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                        Instagram
                      </a>
                    )}
                  </div>
                </div>
              )}
            </aside>

            {/* ── Main Content ── */}
            <main className="flex flex-col gap-6 min-w-0">
              {/* About */}
              <section className="bg-white rounded-2xl ring-1 ring-slate-200 p-6 flex-1">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">About</h2>
                {profileData.bio?.trim() ? (
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{profileData.bio.trim()}</p>
                ) : (
                  <p className="text-sm text-slate-400 italic">{isPublicView ? 'No bio provided.' : 'No bio yet \u2014 click Edit Profile to add one.'}</p>
                )}
              </section>

              {/* Skills */}
              <section className="bg-white rounded-2xl ring-1 ring-slate-200 p-6">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Skills</h2>
                {skillsList.length ? (
                  <div className="flex flex-wrap gap-2">
                    {skillsList.map((skill) => (
                      <span key={skill} className="px-3 py-1 rounded-lg bg-slate-50 ring-1 ring-slate-200 text-slate-700 text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 italic">No skills listed yet.</p>
                )}
              </section>

              {/* Projects */}
              {isPublicView ? <ProjectsSection userId={viewUserId} /> : <ProjectsSection />}

              {/* Resume — own profile only */}
              {!isPublicView && profileData.resume_filename && (
                <section className="bg-white rounded-2xl ring-1 ring-slate-200 p-6">
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Resume</h2>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-slate-50 ring-1 ring-slate-200 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-slate-500" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zm-3 9h6v2h-6v-2zm0 4h6v2h-6v-2zm0-8h2v2h-2V9z"/></svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{profileData.resume_filename}</p>
                      <p className="text-xs text-slate-400">PDF</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={openResume} className="px-3 py-1.5 rounded-lg ring-1 ring-slate-200 text-slate-600 hover:bg-slate-50 transition text-xs font-medium">View</button>
                      <button onClick={downloadResume} className="px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition text-xs font-medium">Download</button>
                    </div>
                  </div>
                </section>
              )}
            </main>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
