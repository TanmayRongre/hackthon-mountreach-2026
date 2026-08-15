import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock,
  Layers,
  Terminal,
  Activity,
  User,
  Shield,
  Send,
  AlertCircle,
  X,
  Database,
  ExternalLink,
  Code,
  Tag
} from 'lucide-react';

export default function Dashboard() {
  const { user, isAuthenticated, isAdmin } = useAuth();

  // Items State
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modal State (Create / Edit)
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Product',
    status: 'active',
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // API Tester State
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'api-tester'
  const [testerMethod, setTesterMethod] = useState('GET');
  const [testerEndpoint, setTesterEndpoint] = useState('/api/health');
  const [testerBody, setTesterBody] = useState('{\n  "title": "Sample Item",\n  "description": "Created via API tester",\n  "category": "Electronics",\n  "status": "active"\n}');
  const [testerLoading, setTesterLoading] = useState(false);
  const [testerResponse, setTesterResponse] = useState(null);

  // Notification Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch Items
  const loadItems = async () => {
    setLoadingItems(true);
    try {
      const res = await api.getItems();
      setItems(res.data || []);
    } catch (err) {
      showToast(err.message || 'Failed to fetch items from backend', 'error');
    } finally {
      setLoadingItems(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  // Handle Create / Edit Submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!isAuthenticated) {
      setFormError('You must be logged in to create or edit items.');
      return;
    }

    setSubmitting(true);
    try {
      if (editingItem) {
        await api.updateItem(editingItem._id, formData);
        showToast('Item updated successfully!');
      } else {
        await api.createItem(formData);
        showToast('Item created successfully!');
      }
      setModalOpen(false);
      setEditingItem(null);
      setFormData({ title: '', description: '', category: 'Product', status: 'active' });
      loadItems();
    } catch (err) {
      setFormError(err.message || 'Failed to save item');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (item) => {
    if (!isAuthenticated) {
      showToast('Please login to edit this item', 'error');
      return;
    }
    const isOwner = item.createdBy?._id === user?._id || item.createdBy === user?._id;
    if (!isOwner && !isAdmin) {
      showToast('Only the author or an admin can edit this item', 'error');
      return;
    }

    setEditingItem(item);
    setFormData({
      title: item.title || '',
      description: item.description || '',
      category: item.category || 'Product',
      status: item.status || 'active',
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleDeleteClick = async (item) => {
    if (!isAuthenticated) {
      showToast('Please login to delete items', 'error');
      return;
    }
    const isOwner = item.createdBy?._id === user?._id || item.createdBy === user?._id;
    if (!isOwner && !isAdmin) {
      showToast('Only the author or an admin can delete this item', 'error');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
      return;
    }

    try {
      await api.deleteItem(item._id);
      showToast('Item deleted successfully');
      loadItems();
    } catch (err) {
      showToast(err.message || 'Failed to delete item', 'error');
    }
  };

  // API Tester Execute
  const runTesterRequest = async (overrideMethod, overrideEndpoint, overrideBody) => {
    const method = overrideMethod || testerMethod;
    const endpoint = overrideEndpoint || testerEndpoint;
    const bodyStr = overrideBody !== undefined ? overrideBody : testerBody;

    setTesterLoading(true);
    setTesterResponse(null);

    try {
      let bodyData = null;
      if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase()) && bodyStr) {
        bodyData = JSON.parse(bodyStr);
      }

      // Convert endpoint to relative path without /api if starting with /api
      const cleanEndpoint = endpoint.startsWith('/api') ? endpoint.slice(4) : endpoint;
      const res = await api.rawRequest(cleanEndpoint, method, bodyData);
      setTesterResponse(res);
      showToast(`API call ${method} ${endpoint} completed (${res._latency}ms)`);
    } catch (err) {
      setTesterResponse({
        error: true,
        status: err.status || 500,
        message: err.message,
        data: err.data || null,
        latency: err.latency || 0,
      });
      showToast(`API Error: ${err.message}`, 'error');
    } finally {
      setTesterLoading(false);
    }
  };

  // Filtering items
  const categories = ['all', ...new Set(items.map((i) => i.category).filter(Boolean))];
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'pending':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'completed':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
      case 'inactive':
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-xl flex items-center gap-3 transition-all animate-bounce ${
          toast.type === 'error'
            ? 'bg-rose-950/90 border-rose-500/40 text-rose-200'
            : 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
        }`}>
          {toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-400" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          )}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Top Banner / Hero Overview */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-background-card border border-white/10 p-6 sm:p-8 mb-8 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                Backend Verification Suite
              </span>
              <span className="text-xs text-slate-400 font-mono">
                API Base: {api.getBaseUrl()}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Products & Backend Testing Center
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Create, read, update, delete database items, verify JWT authentication, and execute live API calls directly against your Express server.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setEditingItem(null);
                  setFormData({ title: '', description: '', category: 'Product', status: 'active' });
                  setFormError('');
                  setModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>New Item / Product</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-sm font-semibold transition-all"
              >
                <User className="w-4 h-4" />
                <span>Log In to Create Items</span>
              </Link>
            )}

            <button
              onClick={loadItems}
              disabled={loadingItems}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-sm font-medium transition-all disabled:opacity-50"
              title="Refresh database items"
            >
              <RefreshCw className={`w-4 h-4 ${loadingItems ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
          <div className="bg-slate-950/40 rounded-xl p-3 border border-white/5">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Items In Database</span>
            <span className="text-xl font-bold text-white">{items.length}</span>
          </div>
          <div className="bg-slate-950/40 rounded-xl p-3 border border-white/5">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Your Auth Status</span>
            <span className={`text-sm font-semibold flex items-center gap-1.5 mt-0.5 ${isAuthenticated ? 'text-emerald-400' : 'text-slate-400'}`}>
              {isAuthenticated ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" /> {user?.role?.toUpperCase()} ({user?.name})
                </>
              ) : (
                'Guest (Read-Only)'
              )}
            </span>
          </div>
          <div className="bg-slate-950/40 rounded-xl p-3 border border-white/5">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Database Model</span>
            <span className="text-sm font-mono text-indigo-400 mt-0.5 block">Item + User (MongoDB)</span>
          </div>
          <div className="bg-slate-950/40 rounded-xl p-3 border border-white/5">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Live Endpoints</span>
            <span className="text-sm font-mono text-emerald-400 mt-0.5 block">/auth, /items, /health</span>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'products'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Items & Products Catalog ({items.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('api-tester')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'api-tester'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Interactive API Request Tester</span>
        </button>
      </div>

      {/* TAB 1: Products Catalog */}
      {activeTab === 'products' && (
        <div>
          {/* Filters and Search Bar */}
          <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search items by title, description..."
                className="w-full pl-9 pr-4 py-2 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-slate-950/60 border border-white/10 rounded-xl text-xs font-medium text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Categories</option>
                {categories.filter(c => c !== 'all').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-slate-950/60 border border-white/10 rounded-xl text-xs font-medium text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Items Grid */}
          {loadingItems ? (
            <div className="text-center py-20 bg-slate-900/20 rounded-2xl border border-white/5">
              <div className="w-10 h-10 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-slate-400 text-sm">Loading items from MongoDB...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-16 px-4 bg-slate-900/20 border border-white/5 rounded-2xl">
              <Database className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-1">No items found</h3>
              <p className="text-sm text-slate-400 max-w-sm mx-auto mb-6">
                {items.length === 0
                  ? 'Your database is currently empty. Click "New Item" above to add your first product!'
                  : 'No items match your filter criteria.'}
              </p>
              {isAuthenticated && items.length === 0 && (
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setFormData({ title: 'Sample Hackathon Product', description: 'Real-time item synced with MongoDB Atlas', category: 'General', status: 'active' });
                    setModalOpen(true);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-indigo-600/30"
                >
                  Create First Item
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => {
                const isOwner =
                  isAuthenticated &&
                  (item.createdBy?._id === user?._id || item.createdBy === user?._id);
                const canModify = isOwner || isAdmin;

                return (
                  <div
                    key={item._id}
                    className="bg-slate-900/50 backdrop-blur-sm border border-white/10 hover:border-indigo-500/40 rounded-2xl p-5 flex flex-col justify-between transition-all hover:shadow-xl hover:shadow-indigo-500/5 group"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
                          <Tag className="w-3 h-3" /> {item.category || 'General'}
                        </span>
                        <span className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getStatusBadge(item.status)}`}>
                          {item.status}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Footer Info & Actions */}
                    <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
                      <div>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <User className="w-3.5 h-3.5 text-indigo-400" />
                          <span className="font-medium text-slate-300">
                            {item.createdBy?.name || 'Unknown User'}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleEditClick(item)}
                          disabled={!canModify}
                          title={canModify ? 'Edit item' : 'Login as owner or admin to edit'}
                          className={`p-2 rounded-lg border transition-all ${
                            canModify
                              ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white'
                              : 'opacity-30 cursor-not-allowed border-transparent text-slate-600'
                          }`}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item)}
                          disabled={!canModify}
                          title={canModify ? 'Delete item' : 'Login as owner or admin to delete'}
                          className={`p-2 rounded-lg border transition-all ${
                            canModify
                              ? 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/30 text-rose-400'
                              : 'opacity-30 cursor-not-allowed border-transparent text-slate-600'
                          }`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Interactive API Tester Drawer */}
      {activeTab === 'api-tester' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Quick Endpoints Palette */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-3">
                <Code className="w-4 h-4 text-indigo-400" />
                Quick Preset Calls
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Click any pre-built request below to test standard endpoints:
              </p>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setTesterMethod('GET');
                    setTesterEndpoint('/api/health');
                    runTesterRequest('GET', '/api/health');
                  }}
                  className="w-full text-left p-3 rounded-xl bg-slate-950/60 hover:bg-slate-950 border border-white/5 hover:border-indigo-500/30 transition-all flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-400 mr-2">GET</span>
                    <span className="text-xs font-mono text-slate-200">/api/health</span>
                  </div>
                  <Send className="w-3.5 h-3.5 text-slate-500" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTesterMethod('GET');
                    setTesterEndpoint('/api/auth/me');
                    runTesterRequest('GET', '/api/auth/me');
                  }}
                  className="w-full text-left p-3 rounded-xl bg-slate-950/60 hover:bg-slate-950 border border-white/5 hover:border-indigo-500/30 transition-all flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-400 mr-2">GET</span>
                    <span className="text-xs font-mono text-slate-200">/api/auth/me</span>
                  </div>
                  <Send className="w-3.5 h-3.5 text-slate-500" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTesterMethod('GET');
                    setTesterEndpoint('/api/items');
                    runTesterRequest('GET', '/api/items');
                  }}
                  className="w-full text-left p-3 rounded-xl bg-slate-950/60 hover:bg-slate-950 border border-white/5 hover:border-indigo-500/30 transition-all flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-400 mr-2">GET</span>
                    <span className="text-xs font-mono text-slate-200">/api/items</span>
                  </div>
                  <Send className="w-3.5 h-3.5 text-slate-500" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const postPayload = JSON.stringify(
                      {
                        title: 'API Test Product ' + Math.floor(Math.random() * 1000),
                        description: 'Generated from interactive tester',
                        category: 'Electronics',
                        status: 'active',
                      },
                      null,
                      2
                    );
                    setTesterMethod('POST');
                    setTesterEndpoint('/api/items');
                    setTesterBody(postPayload);
                    runTesterRequest('POST', '/api/items', postPayload);
                  }}
                  className="w-full text-left p-3 rounded-xl bg-slate-950/60 hover:bg-slate-950 border border-white/5 hover:border-indigo-500/30 transition-all flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-mono font-bold text-sky-400 mr-2">POST</span>
                    <span className="text-xs font-mono text-slate-200">/api/items</span>
                  </div>
                  <Send className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>
            </div>

            {/* Token Status Info */}
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Authorization Header Status
              </h4>
              <p className="text-xs text-slate-400">
                {isAuthenticated ? (
                  <span className="text-emerald-400 font-mono">
                    ✓ Bearer token attached ({user?.email})
                  </span>
                ) : (
                  <span className="text-amber-400 font-mono">
                    ⚠ No JWT Token (Guest mode). Protected routes will return 401.
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Custom Runner Form & JSON Output */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-indigo-400" />
                Custom HTTP Request Builder
              </h3>

              <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
                <select
                  value={testerMethod}
                  onChange={(e) => setTesterMethod(e.target.value)}
                  className="w-full sm:w-32 py-2.5 px-3 bg-slate-950 border border-white/10 rounded-xl text-sm font-mono font-bold text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>

                <div className="relative flex-1 w-full">
                  <input
                    type="text"
                    value={testerEndpoint}
                    onChange={(e) => setTesterEndpoint(e.target.value)}
                    placeholder="/api/items or /api/health"
                    className="w-full py-2.5 px-4 bg-slate-950 border border-white/10 rounded-xl text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => runTesterRequest()}
                  disabled={testerLoading}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold rounded-xl text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {testerLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Request</span>
                    </>
                  )}
                </button>
              </div>

              {['POST', 'PUT', 'PATCH'].includes(testerMethod) && (
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Request Body (JSON)
                  </label>
                  <textarea
                    rows={5}
                    value={testerBody}
                    onChange={(e) => setTesterBody(e.target.value)}
                    className="w-full p-3 bg-slate-950 font-mono text-xs text-indigo-200 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

              {/* Response Viewer */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Response Output
                  </span>
                  {testerResponse && (
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                        testerResponse._status < 300 || (!testerResponse.error && !testerResponse.status)
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                        Status: {testerResponse._status || testerResponse.status || 200}
                      </span>
                      {testerResponse._latency && (
                        <span className="text-xs font-mono text-slate-400">
                          {testerResponse._latency}ms
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <pre className="p-4 bg-slate-950 border border-white/10 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto max-h-96">
                  {testerLoading ? (
                    <span className="text-slate-500">Executing HTTP request against backend...</span>
                  ) : testerResponse ? (
                    JSON.stringify(testerResponse, null, 2)
                  ) : (
                    <span className="text-slate-600">Send a request to see the live JSON response.</span>
                  )}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Item Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative overflow-hidden">
            
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <h3 className="text-lg font-bold text-white">
                {editingItem ? 'Edit Item' : 'Create New Item'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Next-gen AI Monitor"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of the product or item..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Electronics, Tools"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 mt-6">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingItem ? 'Update Item' : 'Create Item'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
