import React, { useState, useEffect } from 'react';
import { FileText, Download } from 'lucide-react';
import Header from '../components/Header'; // Use Header instead of Navbar
import Footer from '../components/Footer';
import { API_BASE_URL } from '../config';

const ResourcesPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/resources.php`)
      .then(res => res.json())
      .then(data => { setDocuments(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <Header onOpenDonate={() => {}} />
      <div className="bg-blue-900 text-white py-24 px-6 text-center mt-16">
        <h1 className="text-4xl font-bold mb-2">Trust Resources</h1>
        <p className="text-blue-200">Transparency is our core value.</p>
      </div>

      <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-12">
        {loading ? <p className="text-center">Loading...</p> : (
            <div className="grid md:grid-cols-2 gap-6">
                {documents.map((doc) => (
                    <div key={doc.id} className="bg-white p-6 rounded-2xl shadow hover:shadow-md flex gap-4">
                        <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 shrink-0"><FileText size={28}/></div>
                        <div className="flex-1">
                            <h3 className="font-bold text-lg">{doc.title}</h3>
                            <p className="text-slate-500 text-sm mb-4">{doc.description}</p>
                            <a href={doc.file_path} target="_blank" className="text-blue-600 font-bold bg-blue-50 px-4 py-2 rounded-lg inline-flex items-center gap-2"><Download size={16}/> Download</a>
                        </div>
                    </div>
                ))}
            </div>
        )}
        {!loading && documents.length===0 && <p className="text-center text-slate-400">No documents yet.</p>}
      </div>
      <Footer />
    </div>
  );
};
export default ResourcesPage;