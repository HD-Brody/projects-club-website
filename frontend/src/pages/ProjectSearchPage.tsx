import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { projectApi, authUtils } from "../utils/api";

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

const CATEGORIES = [
  "Web Development",
  "Mobile App",
  "AI/ML",
  "Data Science",
  "Game Development",
  "UI/UX Design",
  "Other"
];

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

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Search Projects
          </h1>
          <p className="text-lg text-slate-600">
            Find projects that match your interests and skills
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 p-6 bg-white rounded-2xl shadow-sm ring-1 ring-slate-200">
          <form className="space-y-4">
            {/* Search Bar */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Search by keyword
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search project titles and descriptions..."
                className="w-full px-4 py-3 rounded-xl ring-1 ring-slate-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {/* Skills Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={selectedSkills}
                  onChange={(e) => setSelectedSkills(e.target.value)}
                  placeholder="e.g., Python, React, AI"
                  className="w-full px-4 py-3 rounded-xl ring-1 ring-slate-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl ring-1 ring-slate-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Sort by
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl ring-1 ring-slate-300 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
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
                className="px-6 py-2 rounded-xl ring-1 ring-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
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
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
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
                          By {project.owner.name || project.owner.email} ·{" "}
                          {new Date(project.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {project.category && (
                        <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
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
                        className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium"
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
                  className="px-4 py-2 rounded-lg bg-white ring-1 ring-slate-300 text-slate-700 hover:bg-slate-50 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <span className="text-slate-600">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg bg-white ring-1 ring-slate-300 text-slate-700 hover:bg-slate-50 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Apply for "{selectedProject.title}"
              </h2>
              <p className="text-gray-600 mb-6">
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
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <input
                    type="text"
                    id="role"
                    value={applyRole}
                    onChange={(e) => setApplyRole(e.target.value)}
                    placeholder="e.g., Frontend Developer, Designer, Project Manager"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={applyLoading}
                    className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 font-medium"
                  >
                    {applyLoading ? "Submitting..." : "Submit Application"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
