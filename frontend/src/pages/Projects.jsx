import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import ProjectFilters from '../components/ProjectFilters';
import { useTranslation } from 'react-i18next';

const Projects = () => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    q: '',
    category: '',
    status: '',
    min_budget: '',
    max_budget: '',
    sort: 'date'
  });
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  const fetchProjects = useCallback(async () => {
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
  }, [filters, pagination.page]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

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

  const getStatusBadge = (status) => {
    switch(status) {
      case 'open': 
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            {t('projects.statusOpen')}
          </span>
        );
      case 'in_progress': 
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            {t('projects.statusInProgress')}
          </span>
        );
      case 'completed': 
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {t('projects.statusCompleted')}
          </span>
        );
      default: 
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            {t('projects.statusOpen')}
          </span>
        );
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Web Development': '🌐',
      'Mobile Development': '📱',
      'Design': '🎨',
      'Writing': '✍️',
      'Marketing': '📣',
      'Video': '🎬',
      'Data': '📊',
      'Other': '📦'
    };
    return icons[category] || '📋';
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Az önce';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} dk önce`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} saat önce`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} gün önce`;
    return new Date(date).toLocaleDateString('tr-TR');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t('projects.browseProjects')}
              </h1>
              <p className="text-base text-gray-500 dark:text-gray-400 mt-1">
                {projects.length} proje bulundu
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
              
              <Link
                to="/projects/create"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-lg font-medium text-base transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {t('projects.addProject')}
              </Link>
            </div>
          </div>

          {/* Search & Quick Filters */}
          <div className="mt-6 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={t('common.search')}
                value={filters.q}
                onChange={(e) => handleFilterChange({ ...filters, q: e.target.value })}
                className="w-full px-4 py-3 pl-11 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base"
              />
              <svg className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {/* Quick Category Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {['Web Development', 'Mobile Development', 'Design', 'Writing'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleFilterChange({ ...filters, category: filters.category === cat ? '' : cat })}
                  className={`flex-shrink-0 px-4 py-2.5 rounded-lg text-base font-medium transition-colors ${
                    filters.category === cat
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {getCategoryIcon(cat)} {cat.split(' ')[0]}
                </button>
              ))}
              {filters.category && (
                <button
                  onClick={handleClearFilters}
                  className="flex-shrink-0 px-4 py-2.5 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  ✕ Temizle
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-5 animate-pulse">
                <div className="flex justify-between mb-3">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4" />
                <div className="flex justify-between">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Proje bulunamadı</h3>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">Arama kriterlerinize uygun proje yok</p>
            <button
              onClick={handleClearFilters}
              className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
            >
              Filtreleri temizle
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-200 overflow-hidden"
              >
                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                      {project.title}
                    </h3>
                    {getStatusBadge(project.status)}
                  </div>
                  
                  {/* Description */}
                  <p className="text-base text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                    {project.description}
                  </p>
                  
                  {/* Category & Budget */}
                  <div className="flex items-center justify-between">
                    {project.category && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {getCategoryIcon(project.category)} {project.category}
                      </span>
                    )}
                    <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                      ${project.budget}
                    </span>
                  </div>
                </div>
                
                {/* Footer */}
                <div className="px-5 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                      {project.client_name?.charAt(0) || '?'}
                    </div>
                    {project.client_name || 'Anonim'}
                  </div>
                  <span className="text-sm text-gray-400 dark:text-gray-500">
                    {timeAgo(project.created_at)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="group flex items-center gap-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 p-4 transition-all duration-200"
              >
                {/* Icon */}
                <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-3xl">
                  {getCategoryIcon(project.category)}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                      {project.title}
                    </h3>
                    {getStatusBadge(project.status)}
                  </div>
                  <p className="text-base text-gray-500 dark:text-gray-400 truncate">
                    {project.description}
                  </p>
                </div>
                
                {/* Meta */}
                <div className="flex-shrink-0 text-right">
                  <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                    ${project.budget}
                  </div>
                  <div className="text-sm text-gray-400 dark:text-gray-500">
                    {timeAgo(project.created_at)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              disabled={pagination.page === 1}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {[...Array(Math.min(pagination.totalPages, 5))].map((_, i) => (
              <button
                key={i}
                onClick={() => setPagination({ ...pagination, page: i + 1 })}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                  pagination.page === i + 1
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {i + 1}
              </button>
            ))}
            
            <button
              onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              disabled={pagination.page === pagination.totalPages}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
