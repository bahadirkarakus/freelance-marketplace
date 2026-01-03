import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [userPagination, setUserPagination] = useState({ page: 1, totalPages: 1 });
  const [projectPagination, setProjectPagination] = useState({ page: 1, totalPages: 1 });
  const [searchUser, setSearchUser] = useState('');
  const [searchProject, setSearchProject] = useState('');
  const [filterUserType, setFilterUserType] = useState('');
  const [filterProjectStatus, setFilterProjectStatus] = useState('');
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      if (activeTab === 'dashboard') fetchStats();
      if (activeTab === 'users') fetchUsers();
      if (activeTab === 'projects') fetchProjects();
    }
  }, [isAdmin, activeTab, userPagination.page, projectPagination.page]);

  const checkAdminAccess = async () => {
    try {
      const response = await api.get('/admin/check');
      if (response.data.isAdmin) {
        setIsAdmin(true);
      } else {
        toast.error('Admin access required');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('Admin access required');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams({
        page: userPagination.page,
        limit: 10,
        ...(searchUser && { search: searchUser }),
        ...(filterUserType && { user_type: filterUserType })
      });
      const response = await api.get(`/admin/users?${params}`);
      setUsers(response.data.users);
      setUserPagination(prev => ({ ...prev, totalPages: response.data.pagination.totalPages }));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const params = new URLSearchParams({
        page: projectPagination.page,
        limit: 10,
        ...(searchProject && { search: searchProject }),
        ...(filterProjectStatus && { status: filterProjectStatus })
      });
      const response = await api.get(`/admin/projects?${params}`);
      setProjects(response.data.projects);
      setProjectPagination(prev => ({ ...prev, totalPages: response.data.pagination.totalPages }));
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User deleted successfully');
      fetchUsers();
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete user');
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.delete(`/admin/projects/${id}`);
      toast.success('Project deleted successfully');
      fetchProjects();
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete project');
    }
  };

  const handleUpdateProjectStatus = async (id, status) => {
    try {
      await api.put(`/admin/projects/${id}/status`, { status });
      toast.success('Project status updated');
      fetchProjects();
      fetchStats();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/users/${editingUser.id}`, editingUser);
      toast.success('User updated successfully');
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <span className="text-2xl">⚙️</span>
            Admin Panel
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {['dashboard', 'users', 'projects'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {tab === 'dashboard' && '📊 Dashboard'}
              {tab === 'users' && '👥 Users'}
              {tab === 'projects' && '📁 Projects'}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && stats && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon="👥" label="Total Users" value={stats.totalUsers} color="blue" />
              <StatCard icon="💼" label="Freelancers" value={stats.totalFreelancers} color="purple" />
              <StatCard icon="🏢" label="Clients" value={stats.totalClients} color="green" />
              <StatCard icon="📁" label="Total Projects" value={stats.totalProjects} color="orange" />
              <StatCard icon="🟢" label="Open Projects" value={stats.openProjects} color="emerald" />
              <StatCard icon="✅" label="Completed" value={stats.completedProjects} color="teal" />
              <StatCard icon="📝" label="Total Bids" value={stats.totalBids} color="indigo" />
              <StatCard icon="💰" label="Revenue" value={`$${stats.totalRevenue?.toLocaleString() || 0}`} color="yellow" />
            </div>

            {/* Recent Activity */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Users</h3>
                <div className="space-y-3">
                  {stats.recentUsers?.map((user, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                      <span className="text-gray-700 dark:text-gray-300">{user.title}</span>
                      <span className="text-sm text-gray-500">{new Date(user.created_at).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Projects</h3>
                <div className="space-y-3">
                  {stats.recentProjects?.map((project, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                      <span className="text-gray-700 dark:text-gray-300 truncate">{project.title}</span>
                      <span className="text-sm text-gray-500">{new Date(project.created_at).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
            {/* Filters */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap gap-4">
              <input
                type="text"
                placeholder="Search users..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <select
                value={filterUserType}
                onChange={(e) => { setFilterUserType(e.target.value); setUserPagination(p => ({...p, page: 1})); }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Types</option>
                <option value="client">Clients</option>
                <option value="freelancer">Freelancers</option>
              </select>
              <button onClick={fetchUsers} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                Search
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">User</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Rating</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Admin</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium">
                            {u.name?.charAt(0)}
                          </div>
                          <span className="text-gray-900 dark:text-white font-medium">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          u.user_type === 'freelancer' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                          {u.user_type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                        ⭐ {u.rating?.toFixed(1) || '0.0'}
                      </td>
                      <td className="px-4 py-3">
                        {u.is_admin ? <span className="text-green-500">✓</span> : <span className="text-gray-400">-</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingUser(u)}
                            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded hover:bg-blue-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="px-3 py-1 text-sm bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded hover:bg-red-200"
                            disabled={u.id === user?.id}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">
                Page {userPagination.page} of {userPagination.totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setUserPagination(p => ({...p, page: p.page - 1}))}
                  disabled={userPagination.page === 1}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setUserPagination(p => ({...p, page: p.page + 1}))}
                  disabled={userPagination.page >= userPagination.totalPages}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
            {/* Filters */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap gap-4">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchProject}
                onChange={(e) => setSearchProject(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchProjects()}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <select
                value={filterProjectStatus}
                onChange={(e) => { setFilterProjectStatus(e.target.value); setProjectPagination(p => ({...p, page: 1})); }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Statuses</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button onClick={fetchProjects} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                Search
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Project</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Client</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Budget</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {projects.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3">
                        <div className="text-gray-900 dark:text-white font-medium">{p.title}</div>
                        <div className="text-sm text-gray-500">{p.category}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{p.client_name}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">${p.budget}</td>
                      <td className="px-4 py-3">
                        <select
                          value={p.status}
                          onChange={(e) => handleUpdateProjectStatus(p.id, e.target.value)}
                          className={`px-2 py-1 rounded text-xs font-medium border-0 ${
                            p.status === 'open' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                            p.status === 'in_progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                            p.status === 'completed' ? 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300' :
                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}
                        >
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDeleteProject(p.id)}
                          className="px-3 py-1 text-sm bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">
                Page {projectPagination.page} of {projectPagination.totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setProjectPagination(p => ({...p, page: p.page - 1}))}
                  disabled={projectPagination.page === 1}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setProjectPagination(p => ({...p, page: p.page + 1}))}
                  disabled={projectPagination.page >= projectPagination.totalPages}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Edit User</h3>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">User Type</label>
                <select
                  value={editingUser.user_type}
                  onChange={(e) => setEditingUser({...editingUser, user_type: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="client">Client</option>
                  <option value="freelancer">Freelancer</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isAdmin"
                  checked={editingUser.is_admin}
                  onChange={(e) => setEditingUser({...editingUser, is_admin: e.target.checked})}
                  className="rounded"
                />
                <label htmlFor="isAdmin" className="text-sm text-gray-700 dark:text-gray-300">Admin privileges</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, label, value, color }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    emerald: 'from-emerald-500 to-emerald-600',
    teal: 'from-teal-500 to-teal-600',
    indigo: 'from-indigo-500 to-indigo-600',
    yellow: 'from-yellow-500 to-yellow-600',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${colorClasses[color]} flex items-center justify-center text-2xl`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
