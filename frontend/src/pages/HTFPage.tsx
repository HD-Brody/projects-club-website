import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { htfApi, authUtils } from "../utils/api";

interface HTFSubmission {
  id: number;
  project_name: string;
  team_name: string;
  youtube_url: string;
  description: string | null;
  created_at: string;
  submitter: {
    id: number;
    name: string;
  };
}

// Extract YouTube video ID from various URL formats
function getYoutubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export default function HTFPage() {
  const [submissions, setSubmissions] = useState<HTFSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(true);
  const isAuthenticated = authUtils.isAuthenticated();

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [teamName, setTeamName] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  // Fetch submissions
  const fetchSubmissions = async () => {
    setLoading(true);
    setError(null);

    const result = await htfApi.getSubmissions();

    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setSubmissions(result.data.submissions);
      if (result.data.reveal !== undefined) setRevealed(result.data.reveal);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    const result = await htfApi.createSubmission({
      project_name: projectName,
      team_name: teamName,
      youtube_url: youtubeUrl,
      description: description || undefined,
    });

    if (result.error) {
      setSubmitError(result.error);
    } else {
      setSubmitSuccess("Project submitted successfully!");
      setProjectName("");
      setTeamName("");
      setYoutubeUrl("");
      setDescription("");
      fetchSubmissions();
      setTimeout(() => {
        setShowForm(false);
        setSubmitSuccess("");
      }, 2000);
    }

    setSubmitting(false);
  };

  const handleDelete = async (submissionId: number) => {
    if (!confirm("Are you sure you want to delete this submission?")) return;

    const result = await htfApi.deleteSubmission(submissionId);

    if (result.error) {
      alert(result.error);
    } else {
      fetchSubmissions();
    }
  };

  // Get current user ID from token (basic extraction)
  const getCurrentUserId = (): number | null => {
    try {
      const token = authUtils.getToken();
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return parseInt(payload.sub, 10);
    } catch {
      return null;
    }
  };

  const currentUserId = getCurrentUserId();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <a
          href="#"
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 mb-8 text-sm transition"
        >
          ← Home
        </a>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Hack the Future
          </h1>
          <p className="text-sm text-slate-500 max-w-3xl">
            Check out the amazing projects built at our hackathon. Watch demo videos and get inspired by fellow club members.
          </p>

          {/* Notice when submissions are hidden */}
          {!revealed && (
            <div className="mt-4 flex items-center gap-3 p-4 bg-white rounded-xl ring-1 ring-slate-200 text-sm text-slate-600">
              <span className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-600 text-white flex items-center justify-center text-xs font-bold">i</span>
              <span>Submissions are hidden until after the event. Only your own project are shown below.</span>
            </div>
          )}
        </div>

        {/* Submit Button (if authenticated) */}
        {isAuthenticated && !showForm && (
          <div className="mb-8">
            <button
              onClick={() => setShowForm(true)}
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition"
            >
              + Submit Your Project
            </button>
          </div>
        )}

        {/* Login prompt for unauthenticated users */}
        {!isAuthenticated && (
          <div className="mb-8 bg-white rounded-2xl ring-1 ring-slate-200 p-6">
            <p className="text-sm text-slate-600 mb-3">
              Built a project at Hack the Future?
            </p>
            <a
              href="#/login"
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-sm font-semibold transition inline-block"
            >
              Login to Submit Your Project
            </a>
          </div>
        )}

        {/* Submission Form */}
        {showForm && (
          <div className="bg-white rounded-2xl ring-1 ring-slate-200 p-6 mb-8 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Submit Your Hackathon Project
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-700 mb-1.5">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g., AI Study Buddy"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 outline-none text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1.5">
                  Team Name *
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g., Team Rocket"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 outline-none text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1.5">
                  YouTube URL *
                </label>
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 outline-none text-sm"
                  required
                />
                <p className="text-xs text-slate-400 mt-1">
                  Link to your demo video on YouTube
                </p>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1.5">
                  Description (optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of your project..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 outline-none text-sm resize-none"
                />
              </div>

              {submitError && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                  {submitError}
                </div>
              )}

              {submitSuccess && (
                <div className="p-3 bg-green-50 text-green-600 rounded-lg text-sm">
                  {submitSuccess}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Project"}
              </button>
            </form>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin"></div>
            <p className="mt-3 text-slate-500">Loading submissions...</p>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
            <button
              onClick={fetchSubmissions}
              className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg hover:opacity-90"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && submissions.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl ring-1 ring-slate-200">
            <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">
              No submissions yet
            </h3>
            <p className="text-sm text-slate-500">
              Be the first to share your hackathon project!
            </p>
          </div>
        )}

        {/* Submissions Grid */}
        {!loading && !error && submissions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {submissions.map((submission) => {
              const videoId = getYoutubeVideoId(submission.youtube_url);
              const thumbnailUrl = videoId
                ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
                : null;

              return (
                <div
                  key={submission.id}
                  className="bg-white rounded-2xl ring-1 ring-slate-200 overflow-hidden hover:shadow-md transition group"
                >
                  {/* Video Thumbnail */}
                  <a
                    href={submission.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block relative aspect-video bg-slate-100"
                  >
                    {thumbnailUrl ? (
                      <img
                        src={thumbnailUrl}
                        alt={submission.project_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </a>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900 mb-1 truncate">
                      {submission.project_name}
                    </h3>

                    <p className="text-xs font-medium text-slate-500 mb-2">
                      {submission.team_name}
                    </p>

                    {submission.description && (
                      <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                        {submission.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">
                        by{" "}
                        <a href={`#/profile/${submission.submitter.id}`} className="font-medium text-slate-700 hover:text-slate-900 hover:underline transition">
                          {submission.submitter.name}
                        </a>
                      </span>

                      {currentUserId === submission.submitter.id && (
                        <button
                          onClick={() => handleDelete(submission.id)}
                          className="text-red-500 hover:text-red-700 text-xs"
                          title="Delete submission"
                        >
                          Delete
                        </button>
                      )}
                    </div>

                    <div className="mt-2 text-xs text-slate-400">
                      {new Date(submission.created_at).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
