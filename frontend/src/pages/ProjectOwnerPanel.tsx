import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { projectApi } from '../utils/api';
import { PROJECT_CATEGORIES } from '../constants/categories';

interface Applicant {
  id: number;
  email: string;
  name: string;
}

interface ProjectApplication {
  id: number;
  project_id: number;
  user_id: number;
  role: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  applicant: Applicant;
}

interface OwnedProject {
  id: number;
  title: string;
  description: string;
  category: string;
  skills?: string;
  created_at: string;
  application_count?: number;
  applications?: ProjectApplication[];
}

const ProjectOwnerPanel: React.FC = () => {
  const [projects, setProjects] = useState<OwnedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedProject, setExpandedProject] = useState<number | null>(null);
  const [applicationUpdating, setApplicationUpdating] = useState<number | null>(null);

  // Edit modal state
  const [editingProject, setEditingProject] = useState<OwnedProject | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    category: '',
    skills: '',
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  // Delete confirmation state
  const [deletingProject, setDeletingProject] = useState<OwnedProject | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    loadOwnedProjects();
  }, []);

  const loadOwnedProjects = async () => {
    setLoading(true);
    setError('');

    const result = await projectApi.getMyProjects();

    if (result.error) {
      setError(result.error);
    } else {
      setProjects(result.data || []);
    }

    setLoading(false);
  };

  const handleUpdateApplicationStatus = async (
    applicationId: number,
    status: 'accepted' | 'rejected'
  ) => {
    setApplicationUpdating(applicationId);

    const result = await projectApi.updateApplicationStatus(applicationId, status);

    if (result.error) {
      setError(result.error);
    } else {
      setProjects((prevProjects) =>
        prevProjects.map((project) => ({
          ...project,
          applications: project.applications?.map((app) =>
            app.id === applicationId ? { ...app, status } : app
          ),
        }))
      );
    }

    setApplicationUpdating(null);
  };

  const loadProjectApplications = async (projectId: number) => {
    const result = await projectApi.getProjectApplications(projectId);

    if (!result.error) {
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === projectId ? { ...project, applications: result.data } : project
        )
      );
    }
  };

  const toggleProjectExpanded = (projectId: number) => {
    if (expandedProject === projectId) {
      setExpandedProject(null);
    } else {
      setExpandedProject(projectId);
      loadProjectApplications(projectId);
    }
  };

  const openEditModal = (project: OwnedProject) => {
    setEditingProject(project);
    setEditForm({
      title: project.title,
      description: project.description,
      category: project.category,
      skills: project.skills || '',
    });
    setEditError('');
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    setEditLoading(true);
    setEditError('');

    const result = await projectApi.updateProject(editingProject.id, editForm);

    if (result.error) {
      setEditError(result.error);
    } else {
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === editingProject.id
            ? { ...project, ...editForm }
            : project
        )
      );
      setEditingProject(null);
    }

    setEditLoading(false);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProject) return;

    setDeleteLoading(true);

    const result = await projectApi.deleteProject(deletingProject.id);

    if (result.error) {
      setError(result.error);
    } else {
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.id !== deletingProject.id)
      );
    }

    setDeleteLoading(false);
    setDeletingProject(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      case 'pending':
      default:
        return 'text-yellow-600';
    }
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

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Projects</h1>
          <p className="text-sm text-slate-500">Manage your projects, edit details, and review applications</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-slate-600 border-r-transparent"></div>
            <p className="mt-4 text-sm text-slate-500">Loading your projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white rounded-2xl ring-1 ring-slate-200 p-8 text-center">
            <p className="text-sm text-slate-500 mb-4">You haven't created any projects yet.</p>
            <a
              href="#/submit-project"
              className="inline-block px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition"
            >
              Create Your First Project
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-2xl ring-1 ring-slate-200 overflow-hidden">
                {/* Project Header */}
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900">{project.title}</h3>
                      <p className="text-sm text-slate-500 mt-1">{project.category}</p>
                      {project.skills && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {project.skills.split(',').map((skill, idx) => (
                            <span key={idx} className="px-2 py-0.5 text-xs bg-slate-50 ring-1 ring-slate-200 text-slate-600 rounded-md">
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                    <div className="ml-4 flex flex-col gap-2 items-end">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(project)}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg ring-1 ring-slate-200 text-slate-700 hover:bg-slate-50 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeletingProject(project)}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg ring-1 ring-red-200 text-red-600 hover:bg-red-50 transition"
                        >
                          Delete
                        </button>
                      </div>
                      <button
                        onClick={() => toggleProjectExpanded(project.id)}
                        className="flex items-center gap-1.5 text-slate-700 hover:text-slate-900 text-sm font-medium transition"
                      >
                        <span>View Applications</span>
                        {project.application_count ? (
                          <span className="px-1.5 py-0.5 rounded-full bg-slate-100 ring-1 ring-slate-200 text-slate-700 text-xs">
                            {project.application_count}
                          </span>
                        ) : null}
                        <svg
                          className={`w-4 h-4 transition-transform ${expandedProject === project.id ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Applications Section */}
                {expandedProject === project.id && (
                  <div className="border-t border-slate-200 bg-slate-50 p-6">
                    <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
                      Applications ({project.applications?.length || 0})
                    </h4>

                    {!project.applications || project.applications.length === 0 ? (
                      <p className="text-sm text-slate-500 text-center py-8">No applications yet</p>
                    ) : (
                      <div className="space-y-3">
                        {project.applications.map((app) => (
                          <div
                            key={app.id}
                            className="bg-white p-4 rounded-xl ring-1 ring-slate-200"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <a href={`#/profile/${app.user_id}`} className="text-sm font-medium text-slate-900 hover:text-slate-700 hover:underline transition">
                                  {app.applicant?.name || 'Unknown'}
                                </a>
                                <p className="text-xs text-slate-500">
                                  {app.applicant?.email || 'No email'}
                                </p>
                              </div>
                              <span className={`text-xs font-medium ${getStatusColor(app.status)}`}>
                                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                              </span>
                            </div>

                            <p className="text-sm text-slate-600 mb-3">
                              <span className="font-medium text-slate-700">Role:</span> {app.role} ·{' '}
                              <span className="font-medium text-slate-700">Applied:</span> {new Date(app.created_at).toLocaleDateString()}
                            </p>

                            {app.status === 'pending' && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleUpdateApplicationStatus(app.id, 'accepted')}
                                  disabled={applicationUpdating === app.id}
                                  className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleUpdateApplicationStatus(app.id, 'rejected')}
                                  disabled={applicationUpdating === app.id}
                                  className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-8">
          <a
            href="#/submit-project"
            className="inline-block px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition"
          >
            + Create New Project
          </a>
        </div>
      </div>

      {/* Edit Modal */}
      {editingProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl ring-1 ring-slate-200 p-6 max-w-lg w-full shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900">Edit Project</h3>
              <button
                onClick={() => setEditingProject(null)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                ✕
              </button>
            </div>

            {editError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{editError}</p>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-700 mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 outline-none text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1.5">
                  Category
                </label>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 outline-none text-sm"
                  required
                >
                  <option value="">Select a category</option>
                  {PROJECT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1.5">
                  Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 outline-none text-sm resize-none"
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1.5">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={editForm.skills}
                  onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 outline-none text-sm"
                  placeholder="React, Python, UI/UX..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl ring-1 ring-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-sm font-semibold disabled:opacity-50 transition"
                >
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl ring-1 ring-slate-200 p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Project</h3>
            <p className="text-sm text-slate-600 mb-4">
              Are you sure you want to delete <span className="font-medium text-slate-900">"{deletingProject.title}"</span>? This will also remove all applications. This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeletingProject(null)}
                className="flex-1 px-4 py-2.5 rounded-xl ring-1 ring-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 text-sm font-semibold disabled:opacity-50 transition"
              >
                {deleteLoading ? 'Deleting...' : 'Delete Project'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProjectOwnerPanel;
