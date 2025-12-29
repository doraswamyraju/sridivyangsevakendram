import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { API_BASE_URL } from '../config';

const AdminLogin = () => {
  const [creds, setCreds] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/login.php`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(creds)
      });
      const data = await res.json();
      
      if (data.status === 'success') {
        localStorage.setItem('adminToken', data.token); // Save login state
        navigate('/admin/dashboard');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Connection failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm border border-slate-200">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center text-white">
            <Lock size={20} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-blue-950 mb-6">Admin Login</h2>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="text" 
            placeholder="Username" 
            className="w-full p-3 border rounded-lg"
            onChange={e => setCreds({...creds, username: e.target.value})}
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-3 border rounded-lg"
            onChange={e => setCreds({...creds, password: e.target.value})}
          />
          <button className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;