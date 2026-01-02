import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, LogOut, Heart, Users, Image as ImageIcon, 
  Trash2, Upload, Newspaper, Plus, CheckCircle, Clock, Menu, X 
} from 'lucide-react';
import { API_BASE_URL } from '../config';
import logo from '../assets/logo.png'; 

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile Menu State
  
  // --- STATE MANAGEMENT ---
  const [stats, setStats] = useState({ donations: 0, volunteers: 0, pending: 0 });
  const [donations, setDonations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  
  // Gallery State
  const [selectedProgram, setSelectedProgram] = useState('pwd-empowerment');
  const [galleryImages, setGalleryImages] = useState([]);
  
  // News State
  const [newsList, setNewsList] = useState([]);
  const [newsForm, setNewsForm] = useState({ title: '', content: '', image: null });

  // UI State
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
    setIsMobileMenuOpen(false); // Close mobile menu when tab changes
  }, [activeTab, selectedProgram]);

  // --- DATA FETCHING ---
  const fetchData = async () => {
    try {
      const [donRes, volRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admin_data.php?type=donations`),
        fetch(`${API_BASE_URL}/admin_data.php?type=volunteers`)
      ]);
      const donData = await donRes.json();
      const volData = await volRes.json();
      
      setDonations(donData);
      setVolunteers(volData);
      setStats({
        donations: donData.length,
        volunteers: volData.length,
        pending: donData.filter(d => d.payment_status === 'pending').length
      });
    } catch (error) { console.error("Error loading data", error); }
  };

  const fetchGallery = async () => {
      try {
          const res = await fetch(`${API_BASE_URL}/gallery.php?program_id=${selectedProgram}`);
          const data = await res.json();
          setGalleryImages(data);
      } catch (error) { console.error("Error loading gallery", error); }
  };

  const fetchNews = async () => {
      try {
          const res = await fetch(`${API_BASE_URL}/news.php`);
          const data = await res.json();
          setNewsList(data);
      } catch (error) { console.error("Error loading news", error); }
  };

  // --- ACTIONS ---
  const handleUploadGallery = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('image', file);
      formData.append('program_id', selectedProgram);

      setUploading(true);
      try {
          const res = await fetch(`${API_BASE_URL}/gallery.php`, { method: 'POST', body: formData });
          const data = await res.json();
          if (data.url) {
              fetchGallery();
              alert("Image Uploaded Successfully!");
          } else {
              alert("Upload failed: " + (data.message || "Unknown error"));
          }
      } catch (error) { console.error(error); alert("Upload failed."); }
      setUploading(false);
  };

  const handleDeleteGallery = async (id) => {
      if(!window.confirm("Delete this image?")) return;
      try {
          await fetch(`${API_BASE_URL}/gallery.php`, {
              method: 'DELETE',
              body: JSON.stringify({ id })
          });
          fetchGallery();
      } catch (error) { console.error("Delete failed", error); }
  };

  const handlePostNews = async (e) => {
      e.preventDefault();
      if(!newsForm.title || !newsForm.content || !newsForm.image) {
          alert("Please fill all fields and select an image.");
          return;
      }

      const formData = new FormData();
      formData.append('title', newsForm.title);
      formData.append('content', newsForm.content);
      formData.append('image', newsForm.image);

      setUploading(true);
      try {
          const res = await fetch(`${API_BASE_URL}/news.php`, { method: 'POST', body: formData });
          if(res.ok) {
              alert("News Posted!");
              setNewsForm({ title: '', content: '', image: null }); 
              fetchNews();
          } else { alert("Failed to post news"); }
      } catch (error) { console.error(error); }
      setUploading(false);
  };

  const handleDeleteNews = async (id) => {
      if(!window.confirm("Delete this news post?")) return;
      try {
          await fetch(`${API_BASE_URL}/news.php`, {
              method: 'DELETE',
              body: JSON.stringify({ id })
          });
          fetchNews();
      } catch (error) { console.error("Delete failed"); }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      
      {/* --- MOBILE HEADER --- */}
      <div className="md:hidden fixed top-0 w-full bg-blue-900 text-white z-30 flex items-center justify-between p-4 shadow-md">
         <div className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="w-8 h-8 bg-white rounded p-1" />
            <span className="font-bold text-lg">SSK Admin</span>
         </div>
         <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 hover:bg-blue-800 rounded">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
         </button>
      </div>

      {/* --- SIDEBAR --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-20 w-64 bg-blue-900 text-white transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>
        {/* Desktop Logo Area */}
        <div className="hidden md:flex p-6 border-b border-blue-800 items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-1 shrink-0">
             <img src={logo} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">SSK Admin</h1>
            <p className="text-xs text-blue-300">Control Panel</p>
          </div>
        </div>

        {/* Mobile Spacer (to push menu down below header) */}
        <div className="md:hidden h-16"></div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'dashboard' ? 'bg-white text-blue-900 shadow-lg' : 'text-blue-100 hover:bg-blue-800'}`}>
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button onClick={() => setActiveTab('donations')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'donations' ? 'bg-white text-blue-900 shadow-lg' : 'text-blue-100 hover:bg-blue-800'}`}>
            <Heart size={20} /> Donations
          </button>
          <button onClick={() => setActiveTab('volunteers')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'volunteers' ? 'bg-white text-blue-900 shadow-lg' : 'text-blue-100 hover:bg-blue-800'}`}>
            <Users size={20} /> Volunteers
          </button>
          <button onClick={() => setActiveTab('gallery')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'gallery' ? 'bg-white text-blue-900 shadow-lg' : 'text-blue-100 hover:bg-blue-800'}`}>
            <ImageIcon size={20} /> Gallery
          </button>
          <button onClick={() => setActiveTab('news')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'news' ? 'bg-white text-blue-900 shadow-lg' : 'text-blue-100 hover:bg-blue-800'}`}>
            <Newspaper size={20} /> News & Blog
          </button>
        </nav>

        <div className="p-4 border-t border-blue-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-2 text-blue-200 hover:text-white transition-colors px-4 py-2">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* --- OVERLAY for Mobile --- */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 w-full bg-slate-50 overflow-y-auto h-full pt-16 md:pt-0">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 bg-white p-4 rounded-2xl shadow-sm gap-4">
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 capitalize">
                {activeTab === 'dashboard' ? 'Overview' : activeTab}
            </h2>
            <div className="flex items-center gap-2 self-end md:self-auto">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">System Active</span>
            </div>
            </header>

            {/* 1. DASHBOARD TAB */}
            {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
                <div onClick={() => setActiveTab('donations')} className="bg-emerald-500 rounded-2xl p-6 text-white shadow-lg cursor-pointer active:scale-95 md:hover:scale-[1.02] transition-transform">
                    <div className="flex justify-between items-start">
                        <div><h3 className="mb-1 opacity-90 text-sm md:text-base">Total Donations</h3><p className="text-3xl md:text-4xl font-bold">{stats.donations}</p></div>
                        <Heart className="opacity-20" size={40} />
                    </div>
                </div>
                <div onClick={() => setActiveTab('volunteers')} className="bg-blue-500 rounded-2xl p-6 text-white shadow-lg cursor-pointer active:scale-95 md:hover:scale-[1.02] transition-transform">
                    <div className="flex justify-between items-start">
                        <div><h3 className="mb-1 opacity-90 text-sm md:text-base">Total Volunteers</h3><p className="text-3xl md:text-4xl font-bold">{stats.volunteers}</p></div>
                        <Users className="opacity-20" size={40} />
                    </div>
                </div>
                <div onClick={() => setActiveTab('donations')} className="bg-amber-500 rounded-2xl p-6 text-white shadow-lg cursor-pointer active:scale-95 md:hover:scale-[1.02] transition-transform">
                    <div className="flex justify-between items-start">
                        <div><h3 className="mb-1 opacity-90 text-sm md:text-base">Pending Requests</h3><p className="text-3xl md:text-4xl font-bold">{stats.pending}</p></div>
                        <Clock className="opacity-20" size={40} />
                    </div>
                </div>
            </div>
            )}

            {/* 2. DONATIONS TAB */}
            {activeTab === 'donations' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600 min-w-[600px]">
                    <thead className="bg-slate-50 text-slate-800 font-bold uppercase text-xs">
                        <tr>
                        <th className="p-4">Name</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {donations.map((d) => (
                        <tr key={d.id} className="hover:bg-slate-50">
                            <td className="p-4 font-medium text-slate-800">{d.full_name}<br/><span className="text-xs text-slate-400">{d.email}</span></td>
                            <td className="p-4 font-bold text-emerald-600">₹{d.amount}</td>
                            <td className="p-4 whitespace-nowrap">{new Date(d.created_at).toLocaleDateString()}</td>
                            <td className="p-4">
                                {d.payment_status === 'success' ? (
                                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold inline-flex items-center gap-1"><CheckCircle size={12}/> Success</span>
                                ) : (
                                    <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold inline-flex items-center gap-1"><Clock size={12}/> Pending</span>
                                )}
                            </td>
                        </tr>
                        ))}
                        {donations.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-slate-400">No donations found.</td></tr>}
                    </tbody>
                    </table>
                </div>
                </div>
            )}

            {/* 3. VOLUNTEERS TAB */}
            {activeTab === 'volunteers' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600 min-w-[700px]">
                    <thead className="bg-slate-50 text-slate-800 font-bold uppercase text-xs">
                        <tr>
                        <th className="p-4">Name</th>
                        <th className="p-4">Phone</th>
                        <th className="p-4">Interest</th>
                        <th className="p-4">Message</th>
                        <th className="p-4">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {volunteers.map((v) => (
                        <tr key={v.id} className="hover:bg-slate-50">
                            <td className="p-4 font-medium text-slate-800">{v.full_name}<br/><span className="text-xs text-slate-400">{v.email}</span></td>
                            <td className="p-4 whitespace-nowrap">{v.phone}</td>
                            <td className="p-4"><span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-bold whitespace-nowrap">{v.interest || 'N/A'}</span></td>
                            <td className="p-4 max-w-xs truncate" title={v.message}>{v.message || '-'}</td>
                            <td className="p-4 whitespace-nowrap">{new Date(v.created_at).toLocaleDateString()}</td>
                        </tr>
                        ))}
                        {volunteers.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-slate-400">No volunteers found.</td></tr>}
                    </tbody>
                    </table>
                </div>
                </div>
            )}

            {/* 4. GALLERY MANAGER TAB */}
            {activeTab === 'gallery' && (
                <div className="space-y-6">
                    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-stretch md:items-center gap-4">
                        <div className="flex flex-col gap-1 w-full md:w-auto">
                            <label className="font-bold text-slate-700 text-sm">Select Pillar</label>
                            <select 
                                className="border border-slate-300 rounded-lg px-4 py-2 bg-slate-50 font-medium outline-none focus:ring-2 focus:ring-blue-500 w-full"
                                value={selectedProgram}
                                onChange={(e) => setSelectedProgram(e.target.value)}
                            >
                                {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        
                        <div className="md:ml-auto w-full md:w-auto">
                            <label className={`bg-blue-600 text-white px-6 py-2.5 rounded-lg cursor-pointer hover:bg-blue-700 transition flex items-center justify-center gap-2 font-bold shadow-md w-full md:w-auto ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                <Upload size={18} /> {uploading ? "Uploading..." : "Upload New Photo"}
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*" 
                                    onChange={handleUploadGallery} 
                                    disabled={uploading} 
                                />
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {galleryImages.map((img) => (
                            <div key={img.id} className="group relative bg-white rounded-xl shadow-sm border border-slate-200 h-40 md:h-64 flex items-center justify-center p-2">
                                <img 
                                    src={img.image_path} 
                                    alt="Gallery" 
                                    className="max-w-full max-h-full object-contain rounded-md"
                                />
                                <div className="absolute top-2 right-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleDeleteGallery(img.id); }}
                                        className="bg-white text-red-500 p-2 rounded-full shadow-md hover:bg-red-50 hover:scale-110 transition-all border border-slate-100"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {galleryImages.length === 0 && !uploading && (
                            <div className="col-span-full py-16 text-center text-slate-500 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-3">
                                <ImageIcon size={40} className="text-slate-300" />
                                <p className="font-medium">No images uploaded for this pillar yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* 5. NEWS / BLOG TAB */}
            {activeTab === 'news' && (
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Post Form */}
                    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 h-fit order-2 lg:order-1">
                        <h3 className="font-bold text-lg mb-4 text-blue-900 flex items-center gap-2">
                            <Plus size={20} /> Post Update
                        </h3>
                        <form onSubmit={handlePostNews} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Title</label>
                                <input 
                                    type="text" 
                                    className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Title of the news..."
                                    value={newsForm.title}
                                    onChange={e => setNewsForm({...newsForm, title: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Content</label>
                                <textarea 
                                    className="w-full border border-slate-300 rounded-lg p-3 h-32 outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Write the details here..."
                                    value={newsForm.content}
                                    onChange={e => setNewsForm({...newsForm, content: e.target.value})}
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cover Image</label>
                                <input 
                                    type="file" 
                                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    accept="image/*"
                                    onChange={e => setNewsForm({...newsForm, image: e.target.files[0]})}
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={uploading}
                                className="w-full bg-blue-900 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-blue-800 transition-all"
                            >
                                {uploading ? "Publishing..." : "Publish News"}
                            </button>
                        </form>
                    </div>

                    {/* News List */}
                    <div className="lg:col-span-2 space-y-4 order-1 lg:order-2">
                        <h3 className="font-bold text-lg text-slate-700">Recent Updates</h3>
                        {newsList.map(item => (
                            <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-start">
                                <img src={item.image_path} alt="News" className="w-full md:w-24 h-40 md:h-24 object-cover rounded-lg bg-slate-100 shrink-0" />
                                <div className="flex-1 w-full">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-blue-900 text-lg">{item.title}</h4>
                                        <button onClick={() => handleDeleteNews(item.id)} className="text-red-400 hover:text-red-600 p-1">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <p className="text-xs text-slate-400 mb-2">{new Date(item.created_at).toLocaleDateString()}</p>
                                    <p className="text-slate-600 text-sm line-clamp-3 md:line-clamp-2">{item.content}</p>
                                </div>
                            </div>
                        ))}
                        {newsList.length === 0 && <p className="text-slate-400 italic">No news posted yet.</p>}
                    </div>
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;