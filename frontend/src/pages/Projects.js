import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import ProjectFilters from '../components/ProjectFilters';
import { useTranslation } from 'react-i18next';

const Projects = () => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filters, setFilters] = useState({
    q: '',
    category: '',
    status: '',
    min_budget: '',
    max_budget: '',
    sort: 'date'
  });
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  useEffect(() => {
    fetchProjects();
  }, [filters, pagination.page]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });
      
      params.append('page', pagination.page);
      params.append('limit', '12');

      const response = await api.get(`/projects/search?${params}`);
      setProjects(response.data.projects);
      setPagination({
        page: response.data.pagination.page,
        totalPages: response.data.pagination.totalPages
      });
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination({ ...pagination, page: 1 });
  };

  const handleClearFilters = () => {
    setFilters({
      q: '',
      category: '',
      status: '',
      min_budget: '',
      max_budget: '',
      sort: 'date'
    });
    setPagination({ ...pagination, page: 1 });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'open': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200';
      case 'in_progress': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200';
      case 'completed': return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t('projects.browseProjects')}
              </h1>
            </div>
            <Link
              to="/projects/create"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              + {t('projects.addProject')}
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder={t('projects.searchPlaceholder', 'Search projects...')}
              value={filters.q}
              onChange={(e) => handleFilterChange({ ...filters, q: e.target.value })}
              className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden`}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-20">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Filters</h3>
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Clear
                </button>
              </div>
              
              <ProjectFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClear={handleClearFilters}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toggle Sidebar Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden mb-4 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              {sidebarOpen ? '✕ Close Filters' : '☰ Show Filters'}
            </button>

            {/* Projects Grid */}
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 dark:border-gray-600 border-t-blue-600 dark:border-t-blue-400 mb-4"></div>
                <div className="text-xl text-gray-600 dark:text-gray-400">{t('common.loading')}</div>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                <svg className="w-24 h-24 mx-auto text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <div className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('projects.noProjects')}</div>
                <div className="text-gray-500 dark:text-gray-400">{t('projects.clearFilters')}</div>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {projects.map((project) => (
                    <Link
                      key={project.id}
                      to={`/projects/${project.id}`}
                      className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:-translate-y-1"
                    >
                      {/* Header with Status Badge */}
                      <div className="p-6 pb-4">
                        <div className="flex justify-between items-start gap-3 mb-3">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 flex-1">
                            {project.title}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(project.status)}`}>
                            {project.status?.replace('_', ' ') || 'Open'}
                          </span>
                        </div>
                        
                        {project.category && (
                          <div className="mb-3">
                            <span className="inline-block bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-md text-xs font-medium">
                              {project.category}
                            </span>
                          </div>
                        )}
                        
                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
                          {project.description}
                        </p>
                      </div>

                      {/* Budget & Duration */}
                      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex justify-between items-center mb-3">
                          <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Budget</div>
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                              ${project.budget}
                            </div>
                          </div>
                          {project.duration && (
                            <div className="text-right">
                              <div className="text-xs text-gray-500 dark:text-gray-400">Duration</div>
                              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                {project.duration}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                          </svg>
                          {project.client_name || 'Anonymous'}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-10">
                    <button
                      onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                      disabled={pagination.page === 1}
                      className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      ← Previous
                    </button>
                    
                    <div className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold">
                      {pagination.page} / {pagination.totalPages}
                    </div>
                    
                    <button
                      onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                      disabled={pagination.page === pagination.totalPages}
                      className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
