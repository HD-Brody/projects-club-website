import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { projectApi, authUtils } from "../utils/api";
import { PROJECT_CATEGORIES } from "../constants/categories";

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';

interface Project {
  id: number;
  title: string;
  description: string;
  skills: string;
  category: string;
  created_at: string;
  owner: {
    id: number;
    email: string;
    name: string;
  };
  application_count: number;
}

interface SearchResponse {
  projects: Project[];
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export default function ProjectSearchPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Search filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const limit = 10;

  // Apply modal state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [applyRole, setApplyRole] = useState("");
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [applySuccess, setApplySuccess] = useState("");

  // Fetch projects based on current filters
  const fetchProjects = async () => {
    setLoading(true);
    setError(null);

    // Build query string
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (selectedSkills) params.append('skills', selectedSkills);
    if (selectedCategory) params.append('category', selectedCategory);
    params.append('sort', sortBy);
    params.append('page', currentPage.toString());
    params.append('limit', limit.toString());

    try {
      const response = await fetch(`${API_BASE_URL}/api/projects/search?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data: SearchResponse = await response.json();
      setProjects(data.projects);
      setTotalPages(data.pages);
      setTotalResults(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Fetch projects when filters or page changes
  useEffect(() => {
    fetchProjects();
  }, [searchQuery, selectedSkills, selectedCategory, sortBy, currentPage]);

  const handleApplyClick = (project: Project) => {
    if (!authUtils.isAuthenticated()) {
      alert("Please log in to apply for projects");
      window.location.hash = "#/login";
      return;
    }

    setSelectedProject(project);
    setShowApplyModal(true);
    setApplyRole("");
    setApplyError("");
    setApplySuccess("");
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProject || !applyRole.trim()) {
      setApplyError("Please enter a role");
      return;
    }

    setApplyLoading(true);
    setApplyError("");
    setApplySuccess("");

    const result = await projectApi.applyToProject(selectedProject.id, applyRole);

    if (result.error) {
      setApplyError(result.error);
    } else {
      setApplySuccess("Application submitted successfully!");
      setTimeout(() => {
        setShowApplyModal(false);
        setApplyRole("");
        setSelectedProject(null);
      }, 2000);
    }

    setApplyLoading(false);
  };

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
            Search Projects
          </h1>
          <p className="text-sm text-slate-500">
            Find projects that match your interests and skills
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 p-6 bg-white rounded-2xl shadow-sm ring-1 ring-slate-200">
          <form className="space-y-4">
            {/* Search Bar */}
            <div>
              <label className="block text-sm text-slate-700 mb-1.5">
                Search by keyword
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search project titles and descriptions..."
                className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-300 outline-none text-sm"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {/* Skills Filter */}
              <div>
                <label className="block text-sm text-slate-700 mb-1.5">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={selectedSkills}
                  onChange={(e) => setSelectedSkills(e.target.value)}
                  placeholder="e.g., Python, React, AI"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-300 outline-none text-sm"
                />
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm text-slate-700 mb-1.5">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-300 outline-none text-sm"
                >
                  <option value="">All Categories</option>
                  {PROJECT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm text-slate-700 mb-1.5">
                  Sort by
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-300 outline-none text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="az">Alphabetical (A-Z)</option>
                  <option value="most_applications">Most Applications</option>
                </select>
              </div>
            </div>

            {/* Clear Filters Button */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedSkills("");
                  setSelectedCategory("");
                  setSortBy("newest");
                  setCurrentPage(1);
                }}
                className="px-6 py-2 rounded-xl ring-1 ring-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium"
              >
                Clear Filters
              </button>
            </div>
          </form>
        </div>

        {/* Results Count */}
        {!loading && (
          <div className="mb-4 text-sm text-slate-600">
            {totalResults > 0 ? (
              <span>
                Showing {(currentPage - 1) * limit + 1} -{" "}
                {Math.min(currentPage * limit, totalResults)} of {totalResults} projects
              </span>
            ) : (
              <span>No projects found</span>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-slate-600 border-r-transparent"></div>
            <p className="mt-4 text-slate-600">Loading projects...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-800">
            <p className="font-medium">Error loading projects</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Project Cards */}
        {!loading && !error && (
          <>
            {projects.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl shadow-sm ring-1 ring-slate-200">
                <p className="text-lg text-slate-600 mb-2">No projects found</p>
                <p className="text-sm text-slate-500">
                  Try adjusting your search filters
                </p>
              </div>
            ) : (
              <div className="grid gap-6 mb-8">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="p-6 bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">
                          {project.title}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                          By <a href={`#/profile/${project.owner.id}`} className="font-medium text-slate-700 hover:text-slate-900 hover:underline transition">{project.owner.name || project.owner.email}</a> ·{" "}
                          {new Date(project.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {project.category && (
                        <span className="px-3 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-full ring-1 ring-slate-200">
                          {project.category}
                        </span>
                      )}
                    </div>

                    <p className="text-slate-700 mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {project.skills && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.skills.split(',').map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs bg-slate-100 text-slate-700 rounded-lg"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                      <span className="text-sm text-slate-600">
                        {project.application_count} application{project.application_count !== 1 ? 's' : ''}
                      </span>
                      <button
                        onClick={() => handleApplyClick(project)}
                        className="px-4 py-2 text-sm rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-medium transition"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl bg-white ring-1 ring-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Previous
                </button>

                <span className="text-sm text-slate-600">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl bg-white ring-1 ring-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Apply Modal */}
      {showApplyModal && selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl ring-1 ring-slate-200 shadow-xl max-w-md w-full p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-1">
                Apply for "{selectedProject.title}"
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                Let the project owner know what role you're interested in.
              </p>

              {applyError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{applyError}</p>
                </div>
              )}

              {applySuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-sm">{applySuccess}</p>
                </div>
              )}

              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div>
                  <label htmlFor="role" className="block text-sm text-slate-700 mb-1.5">
                    Role *
                  </label>
                  <input
                    type="text"
                    id="role"
                    value={applyRole}
                    onChange={(e) => setApplyRole(e.target.value)}
                    placeholder="e.g., Frontend Developer, Designer, Project Manager"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 outline-none text-sm"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl ring-1 ring-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={applyLoading}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-sm font-semibold disabled:opacity-50 transition"
                  >
                    {applyLoading ? "Submitting..." : "Submit Application"}
                  </button>
                </div>
              </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
