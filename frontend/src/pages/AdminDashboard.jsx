import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, LogOut, Heart, Users, Image as ImageIcon,
  Trash2, Upload, Newspaper, Plus, CheckCircle, Clock, Menu, X,
  FolderOpen, FileText, Download, Layers, ArrowLeft, Calendar, MapPin, Star, Eye
} from 'lucide-react';
import { API_BASE_URL } from '../config';
import logo from '../assets/logo.png';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- STATE ---
  const [stats, setStats] = useState({ donations: 0, volunteers: 0, pending: 0, resources: 0 });
  const [donations, setDonations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);

  // Gallery State
  const [selectedProgram, setSelectedProgram] = useState('pwd-empowerment');
  const [galleryAlbums, setGalleryAlbums] = useState([]);
  const [viewingAlbum, setViewingAlbum] = useState(null);
  const [isCreateAlbumOpen, setIsCreateAlbumOpen] = useState(false);
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    description: '',
    event_date: '',
    venue: '',
    files: [],
    previews: [],
    featuredIndex: 0
  });

  // News State
  const [newsList, setNewsList] = useState([]);
  const [newsForm, setNewsForm] = useState({ title: '', content: '', image: null });

  // Resources State
  const [resourceList, setResourceList] = useState([]);
  const [resourceForm, setResourceForm] = useState({ title: '', description: '', file: null });

  const [uploading, setUploading] = useState(false);

  const programs = [
    { id: 'pwd-empowerment', name: 'PwD Empowerment' },
    { id: 'women-empowerment', name: 'Women Empowerment' },
    { id: 'special-needs', name: 'Children Needs' },
    { id: 'elderly-care', name: 'Elderly Care' },
    { id: 'community-dev', name: 'Community Dev' },
  ];

  // --- INITIAL LOAD ---
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) navigate('/admin');
    fetchData();
  }, [navigate]);

  // --- TAB SWITCH EFFECTS ---
  useEffect(() => {
    if (activeTab === 'gallery') fetchGallery();
    if (activeTab === 'news') fetchNews();
    if (activeTab === 'resources') fetchResources();
    setIsMobileMenuOpen(false); // Close mobile menu when tab changes
  }, [activeTab, selectedProgram]);

  // --- DATA FETCHING ---
  const fetchData = async () => {
    try {
      const [donRes, volRes, resRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admin_data.php?type=donations`),
        fetch(`${API_BASE_URL}/admin_data.php?type=volunteers`),
        fetch(`${API_BASE_URL}/resources.php`)
      ]);
      const donData = await donRes.json();
      const volData = await volRes.json();
      const resData = await resRes.json();

      setDonations(donData);
      setVolunteers(volData);
      setResourceList(resData);
      setStats({
        donations: donData.length,
        volunteers: volData.length,
        pending: donData.filter(d => d.payment_status === 'pending').length,
        resources: resData.length
      });
    } catch (error) { console.error("Error loading data", error); }
  };

  const fetchGallery = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/gallery.php?program_id=${selectedProgram}`);
      const data = await res.json();
      setGalleryAlbums(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error fetching gallery", e);
    }
  };

  const fetchNews = async () => { try { const res = await fetch(`${API_BASE_URL}/news.php`); setNewsList(await res.json()); } catch (e) { } };
  const fetchResources = async () => { try { const res = await fetch(`${API_BASE_URL}/resources.php`); setResourceList(await res.json()); } catch (e) { } };

  // --- HANDLERS ---

  // Resources
  const handleUploadResource = async (e) => {
    e.preventDefault();
    if (!resourceForm.title || !resourceForm.file) { alert("Title and File are required"); return; }

    const formData = new FormData();
    formData.append('title', resourceForm.title);
    formData.append('description', resourceForm.description);
    formData.append('file', resourceForm.file);

    setUploading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/resources.php`, { method: 'POST', body: formData });
      if (res.ok) {
        alert("Resource Uploaded!");
        setResourceForm({ title: '', description: '', file: null });
        fetchResources();
      } else { alert("Upload failed"); }
    } catch (e) { alert("Error uploading"); }
    setUploading(false);
  };

  const handleDeleteResource = async (id) => {
    if (!window.confirm("Delete this document?")) return;
    await fetch(`${API_BASE_URL}/resources.php`, { method: 'DELETE', body: JSON.stringify({ id }) });
    fetchResources();
  };

  // Gallery: File selection & preview
  const handlePhotoSelection = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;
    const previews = selectedFiles.map(file => URL.createObjectURL(file));
    setGalleryForm(prev => ({
      ...prev,
      files: selectedFiles,
      previews: previews,
      featuredIndex: 0
    }));
  };

  // Gallery: Submit new Album
  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    if (!galleryForm.title.trim()) { alert("Please enter an event / program title"); return; }
    if (!galleryForm.description.trim()) { alert("Please enter a program description"); return; }
    if (galleryForm.files.length === 0) { alert("Please select at least one photo"); return; }

    const formData = new FormData();
    formData.append('program_id', selectedProgram);
    formData.append('title', galleryForm.title.trim());
    formData.append('description', galleryForm.description.trim());
    if (galleryForm.event_date) formData.append('event_date', galleryForm.event_date);
    if (galleryForm.venue.trim()) formData.append('venue', galleryForm.venue.trim());
    formData.append('featured_index', galleryForm.featuredIndex);

    for (let i = 0; i < galleryForm.files.length; i++) {
      formData.append('images[]', galleryForm.files[i]);
    }

    setUploading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/gallery.php`, { method: 'POST', body: formData });
      const result = await res.json();
      if (res.ok) {
        alert("Program Album created successfully!");
        setGalleryForm({
          title: '',
          description: '',
          event_date: '',
          venue: '',
          files: [],
          previews: [],
          featuredIndex: 0
        });
        setIsCreateAlbumOpen(false);
        fetchGallery();
      } else {
        alert(result.message || "Failed to create album");
      }
    } catch (err) {
      alert("Error uploading photos");
    }
    setUploading(false);
  };

  // Gallery: Delete Album
  const handleDeleteAlbum = async (albumId) => {
    if (!window.confirm("Are you sure you want to delete this entire album and all its photos?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/gallery.php`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ album_id: albumId })
      });
      if (res.ok) {
        if (viewingAlbum && viewingAlbum.id === albumId) setViewingAlbum(null);
        fetchGallery();
      } else {
        alert("Failed to delete album");
      }
    } catch (err) {
      alert("Error deleting album");
    }
  };

  // Gallery: Delete single photo
  const handleDeletePhoto = async (imageId, albumId) => {
    if (!window.confirm("Delete this photo?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/gallery.php`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_id: imageId })
      });
      if (res.ok) {
        if (viewingAlbum) {
          const updatedImages = viewingAlbum.images.filter(i => i.id !== imageId);
          setViewingAlbum({ ...viewingAlbum, images: updatedImages });
        }
        fetchGallery();
      }
    } catch (err) {
      alert("Error deleting photo");
    }
  };

  // Gallery: Set photo as featured
  const handleSetFeatured = async (albumId, imageId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/gallery.php`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'set_featured', album_id: albumId, image_id: imageId })
      });
      if (res.ok) {
        if (viewingAlbum) {
          const updatedImages = viewingAlbum.images.map(img => ({
            ...img,
            is_featured: img.id === imageId ? 1 : 0
          }));
          const newCover = viewingAlbum.images.find(img => img.id === imageId)?.image_path || viewingAlbum.cover;
          setViewingAlbum({ ...viewingAlbum, images: updatedImages, cover: newCover });
        }
        fetchGallery();
      }
    } catch (err) {
      alert("Error updating featured image");
    }
  };

  // News
  const handlePostNews = async (e) => { e.preventDefault(); const formData = new FormData(); formData.append('title', newsForm.title); formData.append('content', newsForm.content); formData.append('image', newsForm.image); setUploading(true); await fetch(`${API_BASE_URL}/news.php`, { method: 'POST', body: formData }); fetchNews(); setUploading(false); };
  const handleDeleteNews = async (id) => { if (window.confirm("Delete?")) { await fetch(`${API_BASE_URL}/news.php`, { method: 'DELETE', body: JSON.stringify({ id }) }); fetchNews(); } };

  const handleLogout = () => { localStorage.removeItem('adminToken'); navigate('/admin'); };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">

      {/* MOBILE HEADER */}
      <div className="md:hidden fixed top-0 w-full bg-blue-900 text-white z-30 flex items-center justify-between p-4 shadow-md">
        <div className="flex items-center gap-2"><img src={logo} alt="Logo" className="w-8 h-8 bg-white rounded p-1" /><span className="font-bold text-lg">SSK Admin</span></div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 hover:bg-blue-800 rounded">{isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
      </div>

      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-20 w-64 bg-blue-900 text-white transform transition-transform duration-300 shadow-2xl flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <div className="hidden md:flex p-6 border-b border-blue-800 items-center gap-3"><div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-1 shrink-0"><img src={logo} alt="Logo" className="w-full h-full object-contain" /></div><div><h1 className="font-bold text-lg leading-tight">SSK Admin</h1><p className="text-xs text-blue-300">Control Panel</p></div></div>
        <div className="md:hidden h-16"></div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {['dashboard', 'donations', 'volunteers', 'gallery', 'news', 'resources'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium capitalize ${activeTab === tab ? 'bg-white text-blue-900 shadow-lg' : 'text-blue-100 hover:bg-blue-800'}`}>
              {tab === 'dashboard' && <LayoutDashboard size={20} />}
              {tab === 'donations' && <Heart size={20} />}
              {tab === 'volunteers' && <Users size={20} />}
              {tab === 'gallery' && <ImageIcon size={20} />}
              {tab === 'news' && <Newspaper size={20} />}
              {tab === 'resources' && <FolderOpen size={20} />}
              {tab}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-blue-800"><button onClick={handleLogout} className="w-full flex items-center gap-2 text-blue-200 hover:text-white px-4 py-2"><LogOut size={18} /> Logout</button></div>
      </aside>

      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && <div className="fixed inset-0 bg-black/50 z-10 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>}

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full bg-slate-50 overflow-y-auto h-full pt-16 md:pt-0">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 bg-white p-4 rounded-2xl shadow-sm gap-4">
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 capitalize">{activeTab === 'dashboard' ? 'Overview' : activeTab}</h2>
            <div className="flex items-center gap-2 self-end md:self-auto"><div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div><span className="text-xs font-bold text-slate-500 uppercase tracking-wider">System Active</span></div>
          </header>

          {/* DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-8">
              <div onClick={() => setActiveTab('donations')} className="bg-emerald-500 rounded-2xl p-6 text-white shadow-lg cursor-pointer hover:scale-[1.02] transition-transform"><h3 className="opacity-90 text-sm">Total Donations</h3><p className="text-3xl font-bold">{stats.donations}</p></div>
              <div onClick={() => setActiveTab('volunteers')} className="bg-blue-500 rounded-2xl p-6 text-white shadow-lg cursor-pointer hover:scale-[1.02] transition-transform"><h3 className="opacity-90 text-sm">Total Volunteers</h3><p className="text-3xl font-bold">{stats.volunteers}</p></div>
              <div onClick={() => setActiveTab('donations')} className="bg-amber-500 rounded-2xl p-6 text-white shadow-lg cursor-pointer hover:scale-[1.02] transition-transform"><h3 className="opacity-90 text-sm">Pending Requests</h3><p className="text-3xl font-bold">{stats.pending}</p></div>
              <div onClick={() => setActiveTab('resources')} className="bg-purple-600 rounded-2xl p-6 text-white shadow-lg cursor-pointer hover:scale-[1.02] transition-transform"><h3 className="opacity-90 text-sm">Documents</h3><p className="text-3xl font-bold">{stats.resources}</p></div>
            </div>
          )}

          {/* DONATIONS */}
          {activeTab === 'donations' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 min-w-[600px]"><thead className="bg-slate-50 text-slate-800 font-bold uppercase text-xs"><tr><th className="p-4">Name</th><th className="p-4">Amount</th><th className="p-4">Date</th><th className="p-4">Status</th></tr></thead><tbody className="divide-y divide-slate-100">{donations.map(d => <tr key={d.id} className="hover:bg-slate-50"><td className="p-4 font-medium">{d.full_name}<br /><span className="text-xs text-slate-400">{d.email}</span></td><td className="p-4 font-bold text-emerald-600">₹{d.amount}</td><td className="p-4">{new Date(d.created_at).toLocaleDateString()}</td><td className="p-4">{d.payment_status === 'success' ? <span className="text-green-600 font-bold">Success</span> : <span className="text-amber-600 font-bold">Pending</span>}</td></tr>)}</tbody></table>
            </div>
          )}

          {/* VOLUNTEERS */}
          {activeTab === 'volunteers' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 min-w-[700px]"><thead className="bg-slate-50 text-slate-800 font-bold uppercase text-xs"><tr><th className="p-4">Name</th><th className="p-4">Phone</th><th className="p-4">Interest</th><th className="p-4">Message</th></tr></thead><tbody className="divide-y divide-slate-100">{volunteers.map(v => <tr key={v.id} className="hover:bg-slate-50"><td className="p-4 font-medium">{v.full_name}<br /><span className="text-xs text-slate-400">{v.email}</span></td><td className="p-4">{v.phone}</td><td className="p-4">{v.interest}</td><td className="p-4 truncate max-w-xs">{v.message}</td></tr>)}</tbody></table>
            </div>
          )}

          {/* GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              {/* Program Selector & Add Album Header */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1 w-full md:max-w-md">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Program Category</label>
                  <select
                    className="border border-slate-200 p-2.5 rounded-xl w-full bg-slate-50 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedProgram}
                    onChange={(e) => { setSelectedProgram(e.target.value); setViewingAlbum(null); }}
                  >
                    {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>

                <button
                  onClick={() => setIsCreateAlbumOpen(!isCreateAlbumOpen)}
                  className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all"
                >
                  {isCreateAlbumOpen ? <X size={18} /> : <Plus size={18} />}
                  {isCreateAlbumOpen ? "Cancel" : "Add Program Album"}
                </button>
              </div>

              {/* Redesigned Album Creation Card */}
              {isCreateAlbumOpen && (
                <div className="bg-white p-6 rounded-2xl shadow-md border border-blue-100 animate-in fade-in slide-in-from-top-4 duration-300">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Plus className="text-blue-600" size={20} />
                    Create New Program Album
                  </h3>

                  <form onSubmit={handleCreateAlbum} className="space-y-4">
                    {/* 1. Title */}
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                        Program / Event Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="e.g. Annual Wheelchair Distribution Drive 2026"
                        value={galleryForm.title}
                        onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                        required
                      />
                    </div>

                    {/* 2. Description */}
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                        Program Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Describe the event, beneficiaries, goals, and key moments..."
                        value={galleryForm.description}
                        onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                        required
                      ></textarea>
                    </div>

                    {/* 4. Date & Venue (Optional) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                          <Calendar size={14} /> Program Date <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <input
                          type="date"
                          className="w-full border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
                          value={galleryForm.event_date}
                          onChange={(e) => setGalleryForm({ ...galleryForm, event_date: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
                          <MapPin size={14} /> Venue <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          className="w-full border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="e.g. SSK Auditorium, Tirupati"
                          value={galleryForm.venue}
                          onChange={(e) => setGalleryForm({ ...galleryForm, venue: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Photo Picker */}
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                        Select Photos <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="new_gallery_files"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoSelection}
                        className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                      />
                    </div>

                    {/* 3. Featured Image Selection from Selected Photos */}
                    {galleryForm.previews.length > 0 && (
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1">
                            <Star size={14} className="text-amber-500 fill-amber-500" />
                            Click a photo to set as Featured Cover
                          </p>
                          <span className="text-xs text-slate-500">{galleryForm.previews.length} photos selected</span>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                          {galleryForm.previews.map((previewUrl, idx) => (
                            <div
                              key={idx}
                              onClick={() => setGalleryForm({ ...galleryForm, featuredIndex: idx })}
                              className={`relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${galleryForm.featuredIndex === idx ? 'border-amber-500 ring-2 ring-amber-400 scale-105 shadow-md' : 'border-slate-200 opacity-80 hover:opacity-100'}`}
                            >
                              <img src={previewUrl} alt="" className="w-full h-full object-cover" />
                              {galleryForm.featuredIndex === idx && (
                                <div className="absolute top-1 right-1 bg-amber-500 text-white rounded-full p-1 shadow">
                                  <Star size={12} className="fill-white" />
                                </div>
                              )}
                              <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1 rounded">
                                {galleryForm.featuredIndex === idx ? "Featured" : `#${idx + 1}`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsCreateAlbumOpen(false)}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={uploading}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow transition-all disabled:opacity-50"
                      >
                        <Upload size={18} />
                        {uploading ? "Uploading Album..." : "Create Album"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Inside Album Photos View */}
              {viewingAlbum ? (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-in fade-in">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b pb-4">
                    <div className="flex items-start gap-4">
                      <button onClick={() => setViewingAlbum(null)} className="p-2.5 hover:bg-slate-100 rounded-full transition-colors mt-1">
                        <ArrowLeft size={20} className="text-slate-700" />
                      </button>
                      <div>
                        <h3 className="font-bold text-xl text-slate-800">{viewingAlbum.title}</h3>
                        <p className="text-sm text-slate-600 mt-1 max-w-2xl">{viewingAlbum.description}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500 font-medium">
                          {viewingAlbum.event_date && (
                            <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded">
                              <Calendar size={12} /> {new Date(viewingAlbum.event_date).toLocaleDateString()}
                            </span>
                          )}
                          {viewingAlbum.venue && (
                            <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded">
                              <MapPin size={12} /> {viewingAlbum.venue}
                            </span>
                          )}
                          <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                            <Layers size={12} /> {viewingAlbum.images?.length || 0} Photos
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteAlbum(viewingAlbum.id)}
                      className="flex items-center gap-2 text-red-600 hover:bg-red-50 border border-red-200 px-4 py-2 rounded-xl text-sm font-semibold transition-all self-start md:self-center"
                    >
                      <Trash2 size={16} /> Delete Entire Album
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {viewingAlbum.images?.map(img => (
                      <div key={img.id} className="relative group bg-slate-50 p-2 rounded-xl border border-slate-200 hover:shadow-md transition-all">
                        <img src={img.image_path} alt="" className="w-full h-36 object-contain bg-white rounded-lg" />

                        {img.is_featured == 1 && (
                          <div className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                            <Star size={10} className="fill-white" /> Featured
                          </div>
                        )}

                        <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {img.is_featured != 1 && (
                            <button
                              title="Set as Featured Cover"
                              onClick={() => handleSetFeatured(viewingAlbum.id, img.id)}
                              className="bg-white text-amber-500 hover:bg-amber-50 p-1.5 rounded-full shadow"
                            >
                              <Star size={14} />
                            </button>
                          )}
                          <button
                            title="Delete Photo"
                            onClick={() => handleDeletePhoto(img.id, viewingAlbum.id)}
                            className="bg-white text-red-500 hover:bg-red-50 p-1.5 rounded-full shadow"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Albums Grid */
                <div>
                  {galleryAlbums.length === 0 ? (
                    <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 border-dashed">
                      <ImageIcon className="mx-auto text-slate-300 mb-3" size={48} />
                      <h4 className="font-bold text-slate-700 text-lg">No albums in this category yet</h4>
                      <p className="text-slate-400 text-sm mt-1">Click "Add Program Album" above to upload your first event photos.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {galleryAlbums.map(album => (
                        <div
                          key={album.id}
                          className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all flex flex-col group"
                        >
                          {/* Cover Image */}
                          <div
                            onClick={() => setViewingAlbum(album)}
                            className="h-48 bg-slate-100 relative overflow-hidden cursor-pointer"
                          >
                            <img
                              src={album.cover || album.image_path}
                              alt={album.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-sm">
                              <Layers size={12} /> {album.photo_count || album.images?.length || 0}
                            </div>
                            <div className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                              <Star size={10} className="fill-white" /> Featured Cover
                            </div>
                          </div>

                          {/* Info & Actions */}
                          <div className="p-5 flex-1 flex flex-col justify-between">
                            <div>
                              <h4
                                onClick={() => setViewingAlbum(album)}
                                className="font-bold text-slate-800 text-lg hover:text-blue-600 cursor-pointer truncate"
                              >
                                {album.title}
                              </h4>

                              {album.description && (
                                <p className="text-slate-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                                  {album.description}
                                </p>
                              )}

                              <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-400">
                                {album.event_date && (
                                  <span className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
                                    <Calendar size={12} /> {new Date(album.event_date).toLocaleDateString()}
                                  </span>
                                )}
                                {album.venue && (
                                  <span className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded truncate max-w-[180px]">
                                    <MapPin size={12} /> {album.venue}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Card Footer: View & Delete */}
                            <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                              <button
                                onClick={() => setViewingAlbum(album)}
                                className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-semibold text-xs"
                              >
                                <Eye size={14} /> View Photos
                              </button>

                              <button
                                onClick={() => handleDeleteAlbum(album.id)}
                                className="flex items-center gap-1 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg text-xs font-semibold transition-all"
                                title="Delete Album"
                              >
                                <Trash2 size={15} /> Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* NEWS */}
          {activeTab === 'news' && (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm order-2 lg:order-1 h-fit"><h3 className="font-bold mb-4 flex items-center gap-2"><Plus size={20} /> Post Update</h3><form onSubmit={handlePostNews} className="space-y-4"><input className="w-full border p-3 rounded" placeholder="Title" value={newsForm.title} onChange={e => setNewsForm({ ...newsForm, title: e.target.value })} /><textarea className="w-full border p-3 rounded h-32" placeholder="Content" value={newsForm.content} onChange={e => setNewsForm({ ...newsForm, content: e.target.value })}></textarea><input type="file" className="w-full text-sm" accept="image/*" onChange={e => setNewsForm({ ...newsForm, image: e.target.files[0] })} /><button className="w-full bg-blue-900 text-white font-bold py-3 rounded shadow" disabled={uploading}>{uploading ? "Publishing..." : "Publish News"}</button></form></div>
              <div className="lg:col-span-2 space-y-4 order-1 lg:order-2">{newsList.map(item => <div key={item.id} className="bg-white p-4 rounded-xl shadow flex gap-4 items-start"><img src={item.image_path} className="w-24 h-24 object-cover rounded bg-slate-100 shrink-0" /><div className="flex-1"><div className="flex justify-between items-start"><h4 className="font-bold text-blue-900">{item.title}</h4><button onClick={() => handleDeleteNews(item.id)} className="text-red-400 p-1"><Trash2 size={16} /></button></div><p className="text-xs text-slate-400 mb-2">{new Date(item.created_at).toLocaleDateString()}</p><p className="text-slate-600 text-sm line-clamp-2">{item.content}</p></div></div>)}</div>
            </div>
          )}

          {/* RESOURCES */}
          {activeTab === 'resources' && (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm order-2 lg:order-1 h-fit"><h3 className="font-bold mb-4 flex items-center gap-2"><Upload size={20} /> Upload Document</h3><form onSubmit={handleUploadResource} className="space-y-4"><input className="w-full border p-3 rounded" placeholder="Document Title" value={resourceForm.title} onChange={e => setResourceForm({ ...resourceForm, title: e.target.value })} /><textarea className="w-full border p-3 rounded h-24" placeholder="Description (Optional)" value={resourceForm.description} onChange={e => setResourceForm({ ...resourceForm, description: e.target.value })}></textarea><input type="file" className="w-full text-sm" onChange={e => setResourceForm({ ...resourceForm, file: e.target.files[0] })} /><button className="w-full bg-blue-900 text-white font-bold py-3 rounded shadow" disabled={uploading}>{uploading ? "Uploading..." : "Save Document"}</button></form></div>
              <div className="lg:col-span-2 space-y-4 order-1 lg:order-2">{resourceList.map(item => <div key={item.id} className="bg-white p-4 rounded-xl shadow flex justify-between items-center"><div className="flex items-center gap-3"><FileText className="text-purple-600" size={24} /><div><h4 className="font-bold text-slate-800">{item.title}</h4><p className="text-xs text-slate-400">{item.description}</p></div></div><div className="flex gap-2"><a href={item.file_path} target="_blank" rel="noreferrer" className="text-blue-600 p-2"><Download size={18} /></a><button onClick={() => handleDeleteResource(item.id)} className="text-red-400 p-2"><Trash2 size={18} /></button></div></div>)}</div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
