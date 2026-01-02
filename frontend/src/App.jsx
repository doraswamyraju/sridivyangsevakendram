import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicHome from './pages/PublicHome';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProgramDetails from './pages/ProgramDetails';
import ScrollToTop from './components/ScrollToTop'; // <--- Import this
import NewsDetails from './pages/NewsDetails'; // Import the new page
import ResourcesPage from './pages/ResourcesPage';

const App = () => {
  const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('adminToken');
    return token ? children : <Navigate to="/admin" />;
  };

  return (
    <Router>
      <ScrollToTop /> {/* <--- Add this line here */}
      <Routes>
        <Route path="/" element={<PublicHome />} />
        <Route path="/program/:id" element={<ProgramDetails />} />
        
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/news/:id" element={<NewsDetails />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/admin/dashboard" element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
};

export default App;