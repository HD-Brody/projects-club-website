import React, { useState } from 'react';
import { projectApi } from '../utils/api';
import { PROJECT_CATEGORIES } from '../constants/categories';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SubmitProjectPage: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    skills: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!formData.title.trim()) {
      setError('Project title is required');
      setLoading(false);
      return;
    }

    if (!formData.description.trim()) {
      setError('Project description is required');
      setLoading(false);
      return;
    }

    if (!formData.category) {
      setError('Please select a category');
      setLoading(false);
      return;
    }

    const result = await projectApi.createProject({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      skills: formData.skills || undefined,
    });

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess('Project created successfully!');
      setFormData({
        title: '',
        description: '',
        category: '',
        skills: '',
      });

      // Redirect to projects page after 2 seconds
      setTimeout(() => {
        window.location.hash = '#/projects';
      }, 2000);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />

      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <a
          href="#/projects"
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 mb-8 text-sm transition"
        >
          ← Back to Projects
        </a>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Submit a Project</h1>
          <p className="text-sm text-slate-500 max-w-xl">
            Share your project and find collaborators to help bring it to life.
          </p>
        </div>

        <div className="bg-white rounded-2xl ring-1 ring-slate-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-3 bg-green-50 text-green-600 rounded-lg text-sm">
                {success}
              </div>
            )}

            {/* Project Title */}
            <div>
              <label htmlFor="title" className="block text-sm text-slate-700 mb-1.5">
                Project Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., AI-Powered Study Assistant"
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 outline-none text-sm"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm text-slate-700 mb-1.5">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your project in detail. What's the goal? What problem does it solve?"
                rows={5}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 outline-none text-sm resize-none"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm text-slate-700 mb-1.5">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 outline-none text-sm"
              >
                <option value="">Select a category</option>
                {PROJECT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Skills */}
            <div>
              <label htmlFor="skills" className="block text-sm text-slate-700 mb-1.5">
                Required Skills (optional)
              </label>
              <input
                type="text"
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                placeholder="e.g., Python, React, Machine Learning (comma-separated)"
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-300 outline-none text-sm"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SubmitProjectPage;
