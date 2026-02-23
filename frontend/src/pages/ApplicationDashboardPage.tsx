import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
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
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Applications</h1>
          <p className="text-sm text-slate-500">Track your applications and their status</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2">
          {(['all', 'pending', 'accepted', 'rejected'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                statusFilter === filter
                  ? 'bg-slate-900 text-white'
                  : 'bg-white ring-1 ring-slate-200 text-slate-700 hover:bg-slate-50'
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
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-slate-600 border-r-transparent"></div>
            <p className="mt-4 text-sm text-slate-500">Loading applications...</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="bg-white rounded-2xl ring-1 ring-slate-200 p-8 text-center">
            <p className="text-sm text-slate-500 mb-4">
              {statusFilter === 'all'
                ? "You haven't applied to any projects yet."
                : `No ${statusFilter} applications.`}
            </p>
            <a
              href="#/projects"
              className="inline-block px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition"
            >
              Browse Projects
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app) => (
              <div key={app.id} className="bg-white rounded-2xl ring-1 ring-slate-200 p-6 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {app.project?.title || 'Unknown Project'}
                    </h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      <a href={`#/profile/${app.project?.owner?.id}`} className="text-slate-700 hover:text-slate-900 hover:underline transition">{app.project?.owner?.name || 'Unknown'}</a> · {app.project?.category || 'N/A'}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                      app.status
                    )}`}
                  >
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-slate-600">
                    <span className="font-medium text-slate-700">Applied Role:</span> {app.role}
                  </p>
                  <p className="text-sm text-slate-600">
                    <span className="font-medium text-slate-700">Applied on:</span> {new Date(app.created_at).toLocaleDateString()}
                  </p>
                </div>

                {app.status === 'pending' && (
                  <span className="inline-block bg-slate-50 ring-1 ring-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs">
                    Awaiting review...
                  </span>
                )}

                {app.status === 'accepted' && (
                  <span className="inline-block bg-green-50 ring-1 ring-green-200 text-green-700 px-3 py-1.5 rounded-lg text-xs">
                    Congratulations! You've been accepted.
                  </span>
                )}

                {app.status === 'rejected' && (
                  <span className="inline-block bg-red-50 ring-1 ring-red-200 text-red-700 px-3 py-1.5 rounded-lg text-xs">
                    Unfortunately, you were not selected.
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ApplicationDashboardPage;
