import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, LogOut, Heart, Users, Image as ImageIcon,
  Trash2, Upload, Newspaper, Plus, CheckCircle, Clock, Menu, X,
  FolderOpen, FileText, Download
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
  const [galleryImages, setGalleryImages] = useState([]);

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

  const fetchGallery = async () => { try { const res = await fetch(`${API_BASE_URL}/gallery.php?program_id=${selectedProgram}`); setGalleryImages(await res.json()); } catch (e) { } };
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

  // Gallery
  const handleUploadGallery = async (e) => {
    e.preventDefault();
    // Files
    const files = document.getElementById('gallery_files').files;
    if (!files || files.length === 0) return;

    // Title
    const title = document.getElementById('gallery_title').value;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('image[]', files[i]);
    }
    formData.append('program_id', selectedProgram);
    if (title) formData.append('title', title);

    setUploading(true);
    await fetch(`${API_BASE_URL}/gallery.php`, { method: 'POST', body: formData });

    // Reset form
    document.getElementById('gallery_files').value = "";
    document.getElementById('gallery_title').value = "";

    fetchGallery();
    setUploading(false);
  };
  const handleDeleteGallery = async (id) => { if (window.confirm("Delete?")) { await fetch(`${API_BASE_URL}/gallery.php`, { method: 'DELETE', body: JSON.stringify({ id }) }); fetchGallery(); } };

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
              <div className="bg-white p-4 rounded-2xl shadow-sm flex flex-col md:flex-row items-end gap-4">
                <div className="flex-1 w-full">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Select Program</label>
                  <select className="border p-2 rounded w-full bg-slate-50" value={selectedProgram} onChange={(e) => setSelectedProgram(e.target.value)}>{programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Event Title (Optional)</label>
                  <input id="gallery_title" type="text" className="border p-2 rounded w-full" placeholder="e.g. Independence Day 2024" />
                </div>
                <div className="w-full md:w-auto">
                  <label className="bg-blue-600 text-white px-6 py-2 rounded cursor-pointer block text-center truncate">
                    {uploading ? "Uploading..." : "Select Photos"}
                    <input id="gallery_files" type="file" className="hidden" accept="image/*" multiple onChange={handleUploadGallery} disabled={uploading} />
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{galleryImages.map(img => <div key={img.id} className="relative group bg-white p-2 rounded shadow h-40 flex items-center justify-center"><img src={img.image_path} className="max-h-full max-w-full rounded" /><button onClick={() => handleDeleteGallery(img.id)} className="absolute top-2 right-2 bg-white text-red-500 p-2 rounded-full shadow opacity-100 md:opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button></div>)}</div>
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
              <div className="bg-white p-6 rounded-2xl shadow-sm order-2 lg:order-1 h-fit">
                <h3 className="font-bold mb-4 text-blue-900 flex items-center gap-2"><FolderOpen size={20} /> Upload Document</h3>
                <form onSubmit={handleUploadResource} className="space-y-4">
                  <input className="w-full border p-3 rounded-lg" placeholder="Document Title" value={resourceForm.title} onChange={e => setResourceForm({ ...resourceForm, title: e.target.value })} />
                  <textarea className="w-full border p-3 rounded-lg h-20" placeholder="Description (Optional)" value={resourceForm.description} onChange={e => setResourceForm({ ...resourceForm, description: e.target.value })}></textarea>
                  <input type="file" className="w-full text-sm" accept=".pdf,.doc,.docx,.jpg,.png" onChange={e => setResourceForm({ ...resourceForm, file: e.target.files[0] })} />
                  <button className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 rounded-xl shadow-lg" disabled={uploading}>{uploading ? "Uploading..." : "Upload Resource"}</button>
                </form>
              </div>
              <div className="lg:col-span-2 order-1 lg:order-2 space-y-3">
                {resourceList.map(doc => (
                  <div key={doc.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4"><div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 shrink-0"><FileText size={24} /></div><div><h4 className="font-bold text-slate-800">{doc.title}</h4><p className="text-xs text-slate-400">{new Date(doc.created_at).toLocaleDateString()} • {doc.description || 'No description'}</p></div></div>
                    <div className="flex items-center gap-2"><a href={doc.file_path} target="_blank" rel="noreferrer" className="p-2 text-blue-600 bg-blue-50 rounded-lg text-sm font-bold flex items-center gap-1"><Download size={16} /> View</a><button onClick={() => handleDeleteResource(doc.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button></div>
                  </div>
                ))}
                {resourceList.length === 0 && <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300"><p className="text-slate-500">No documents uploaded yet.</p></div>}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;