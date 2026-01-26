import React, { useState, useEffect } from 'react';
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
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => (window.location.hash = '#')}
          className="mb-6 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition"
        >
          ← Back
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Projects</h1>
          <p className="text-gray-600">Manage your projects, edit details, and review applications</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading your projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-600 mb-4">You haven't created any projects yet.</p>
            <a
              href="#/submit-project"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Create Your First Project
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Project Header */}
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{project.category}</p>
                      {project.skills && (
                        <p className="text-xs text-gray-500 mt-1">Skills: {project.skills}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                    <div className="ml-4 flex flex-col gap-2 items-end">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(project)}
                          className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeletingProject(project)}
                          className="px-3 py-1.5 text-sm rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition"
                        >
                          Delete
                        </button>
                      </div>
                      <button
                        onClick={() => toggleProjectExpanded(project.id)}
                        className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm font-medium transition"
                      >
                        <span>View Applications</span>
                        {project.application_count ? (
                          <span className="px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs">
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
                  <div className="border-t border-gray-200 bg-gray-50 p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Applications ({project.applications?.length || 0})
                    </h4>

                    {!project.applications || project.applications.length === 0 ? (
                      <p className="text-gray-600 text-center py-8">No applications yet</p>
                    ) : (
                      <div className="space-y-3">
                        {project.applications.map((app) => (
                          <div
                            key={app.id}
                            className="bg-white p-4 rounded-lg border border-gray-200"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <p className="font-medium text-gray-900">
                                  {app.applicant?.name || 'Unknown'}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {app.applicant?.email || 'No email'}
                                </p>
                              </div>
                              <span className={`text-sm font-medium ${getStatusColor(app.status)}`}>
                                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                              </span>
                            </div>

                            <p className="text-sm text-gray-600 mb-3">
                              <strong>Role:</strong> {app.role} •{' '}
                              <strong>Applied:</strong> {new Date(app.created_at).toLocaleDateString()}
                            </p>

                            {app.status === 'pending' && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleUpdateApplicationStatus(app.id, 'accepted')}
                                  disabled={applicationUpdating === app.id}
                                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:bg-gray-400 transition"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleUpdateApplicationStatus(app.id, 'rejected')}
                                  disabled={applicationUpdating === app.id}
                                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:bg-gray-400 transition"
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
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Create New Project
          </a>
        </div>
      </div>

      {/* Edit Modal */}
      {editingProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Edit Project</h3>
              <button
                onClick={() => setEditingProject(null)}
                className="text-gray-400 hover:text-gray-600"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={editForm.skills}
                  onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="React, Python, UI/UX..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium disabled:bg-gray-400"
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
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Project</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete <strong>"{deletingProject.title}"</strong>? This will also remove all applications for this project. This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeletingProject(null)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium disabled:bg-gray-400"
              >
                {deleteLoading ? 'Deleting...' : 'Delete Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectOwnerPanel;
