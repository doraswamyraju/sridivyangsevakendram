import React, { useEffect, useState } from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { API_BASE_URL } from '../config';

const LatestNews = () => {
  const [news, setNews] = useState([]);
  const navigate = useNavigate(); // Initialize hook

  useEffect(() => {
    fetch(`${API_BASE_URL}/news.php`)
      .then(res => res.json())
      .then(data => setNews(data))
      .catch(err => console.error("Err fetching news"));
  }, []);

  if (news.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-amber-600 uppercase tracking-widest mb-2">What's New</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-blue-950">Latest Updates & Events</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {news.slice(0, 3).map((item) => (
            <div key={item.id} className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all border border-slate-100 overflow-hidden flex flex-col h-full">
              {/* Image */}
              <div className="h-52 w-full overflow-hidden relative">
                <img 
                  src={item.image_path} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 bg-blue-900 text-white px-4 py-1 text-xs font-bold rounded-tr-lg flex items-center gap-2">
                  <Calendar size={12} /> {new Date(item.created_at).toLocaleDateString()}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <h4 className="text-xl font-bold text-blue-900 mb-3 line-clamp-2">{item.title}</h4>
                <p className="text-slate-600 text-sm mb-6 line-clamp-3 flex-grow">
                  {item.content}
                </p>
                
                {/* CHANGED BUTTON: NAVIGATE TO NEWS PAGE */}
                <button 
                  onClick={() => navigate(`/news/${item.id}`)}
                  className="text-amber-600 font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all mt-auto"
                >
                  Read Full Story <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestNews;