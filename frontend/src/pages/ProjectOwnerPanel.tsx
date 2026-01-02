import React, { useState, useEffect } from 'react';
import { projectApi } from '../utils/api';

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
  created_at: string;
  applications?: ProjectApplication[];
}

const ProjectOwnerPanel: React.FC = () => {
  const [projects, setProjects] = useState<OwnedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedProject, setExpandedProject] = useState<number | null>(null);
  const [applicationUpdating, setApplicationUpdating] = useState<number | null>(null);

  useEffect(() => {
    loadOwnedProjects();
  }, []);

  const loadOwnedProjects = async () => {
    setLoading(true);
    setError('');

    // For now, we'll need to fetch all projects and filter for owned ones
    // In a real app, you'd have an endpoint like /api/projects/me
    // This is a temporary implementation using the search endpoint
    const result = await projectApi.searchProjects({ limit: 100 });

    if (result.error) {
      setError(result.error);
    } else {
      // In a real scenario, the backend should return user's owned projects
      // For this demo, we're showing the structure
      setProjects(result.data?.projects || []);
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
      // Update local state
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Management</h1>
          <p className="text-gray-600">Manage your projects and review applications</p>
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
                <div
                  className="p-6 cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => toggleProjectExpanded(project.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{project.category}</p>
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                    <div className="ml-4">
                      <button className="text-blue-600 hover:text-blue-800 font-medium">
                        {expandedProject === project.id ? '▼ Hide' : '▶ Show'} Applications
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
    </div>
  );
};

export default ProjectOwnerPanel;
