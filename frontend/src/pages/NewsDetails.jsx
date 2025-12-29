import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, ArrowLeft, Clock } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { API_BASE_URL } from '../config';

const NewsDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);

    // Fetch all news to find the specific one (Simpler for now)
    // Ideally, you'd have a specific API endpoint like /news.php?id=X
    fetch(`${API_BASE_URL}/news.php`)
      .then(res => res.json())
      .then(data => {
        const item = data.find(n => n.id === parseInt(id));
        setNewsItem(item);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching news:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  
  if (!newsItem) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-xl text-slate-500">News article not found.</p>
        <button onClick={() => navigate('/')} className="text-blue-600 font-bold hover:underline">Go Home</button>
    </div>
  );

  return (
    <>
      <Header onOpenDonate={() => {}} /> {/* Pass empty function if needed or handle global context */}
      
      <main className="min-h-screen pt-24 pb-20 bg-slate-50">
        <article className="container mx-auto px-6 max-w-4xl">
            
            {/* Back Button */}
            <button 
                onClick={() => navigate('/')} 
                className="flex items-center gap-2 text-slate-500 hover:text-blue-900 font-bold mb-8 transition-colors"
            >
                <ArrowLeft size={20} /> Back to Home
            </button>

            {/* Main Content Card */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                
                {/* Cover Image */}
                <div className="h-64 md:h-96 w-full relative">
                    <img 
                        src={newsItem.image_path} 
                        alt={newsItem.title} 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 md:left-10 text-white">
                         <div className="flex items-center gap-4 text-sm font-bold uppercase tracking-wider mb-2 opacity-90">
                            <span className="flex items-center gap-2"><Calendar size={14} /> {new Date(newsItem.created_at).toLocaleDateString()}</span>
                            <span className="flex items-center gap-2"><Clock size={14} /> Update</span>
                         </div>
                    </div>
                </div>

                {/* Article Text */}
                <div className="p-8 md:p-12">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-blue-950 mb-8 leading-tight">
                        {newsItem.title}
                    </h1>
                    
                    <div className="prose prose-lg text-slate-600 max-w-none leading-relaxed whitespace-pre-line">
                        {newsItem.content}
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center">
                        <span className="text-slate-400 text-sm font-medium">Share this story:</span>
                        <div className="flex gap-4">
                             {/* Placeholder share buttons */}
                             <button className="text-blue-600 font-bold text-sm hover:underline">Facebook</button>
                             <button className="text-sky-500 font-bold text-sm hover:underline">Twitter</button>
                             <button className="text-green-600 font-bold text-sm hover:underline">WhatsApp</button>
                        </div>
                    </div>
                </div>

            </div>
        </article>
      </main>

      <Footer />
    </>
  );
};

export default NewsDetails;