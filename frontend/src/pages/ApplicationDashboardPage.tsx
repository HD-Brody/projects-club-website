import React, { useState, useEffect } from 'react';
import { projectApi } from '../utils/api';

interface Application {
  id: number;
  project_id: number;
  role: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  project?: {
    id: number;
    title: string;
    category: string;
    owner?: {
      id: number;
      name: string;
    };
  };
}

const ApplicationDashboardPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    setError('');

    const result = await projectApi.getMyApplications();
    if (result.error) {
      setError(result.error);
    } else {
      setApplications(result.data || []);
    }

    setLoading(false);
  };

  const filteredApplications = applications.filter((app) => {
    if (statusFilter === 'all') return true;
    return app.status === statusFilter;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
          <p className="text-gray-600">Track your applications and their status</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2">
          {(['all', 'pending', 'accepted', 'rejected'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                statusFilter === filter
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
              {filter !== 'all' &&
                ` (${applications.filter((a) => a.status === filter).length})`}
            </button>
          ))}
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
            <p className="text-gray-600">Loading applications...</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-600 mb-4">
              {statusFilter === 'all'
                ? "You haven't applied to any projects yet."
                : `No ${statusFilter} applications.`}
            </p>
            <a
              href="#/projects"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Browse Projects
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app) => (
              <div key={app.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {app.project?.title || 'Unknown Project'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {app.project?.owner?.name || 'Unknown'} • {app.project?.category || 'N/A'}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(
                      app.status
                    )}`}
                  >
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    <strong>Applied Role:</strong> {app.role}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Applied on:</strong> {new Date(app.created_at).toLocaleDateString()}
                  </p>
                </div>

                {app.status === 'pending' && (
                  <div className="flex gap-2">
                    <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded text-sm">
                      Awaiting review...
                    </span>
                  </div>
                )}

                {app.status === 'accepted' && (
                  <div className="flex gap-2">
                    <span className="inline-block bg-green-50 text-green-700 px-3 py-1 rounded text-sm">
                      ✓ Congratulations! You've been accepted.
                    </span>
                  </div>
                )}

                {app.status === 'rejected' && (
                  <div className="flex gap-2">
                    <span className="inline-block bg-red-50 text-red-700 px-3 py-1 rounded text-sm">
                      Unfortunately, you were not selected.
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationDashboardPage;
