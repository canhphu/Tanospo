import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login from './pages/login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Sports from './pages/Sports';
import Weather from './pages/Weather';
import Map from './pages/Map';
import PostPage from './pages/PostPage';
import Profile from './pages/Profile';
import LocationDetailPage from './pages/LocationDetailPage';
import Favorite from './pages/Favorite';
import MyPost from './pages/MyPost';
import VideoHistory from './pages/VideoHistory';
import VideoPage from './pages/VideoPages';
import VideoReview from './pages/VideoReview';

// Route Components
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

// Configuration Error Component
const ConfigError = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h2>Configuration Error</h2>
    <p>Google Client ID is not configured. Please check your .env file and restart the server.</p>
  </div>
);

function App() {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'dummy-client-id';
  
  // Temporarily disable the check to allow testing without Google OAuth
  // if (!clientId || clientId === 'undefined') {
  //   return <ConfigError />;
  // }
  
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/sports" element={<ProtectedRoute><Sports /></ProtectedRoute>} />
            <Route path="/weather" element={<ProtectedRoute><Weather /></ProtectedRoute>} />
            <Route path="/map" element={<ProtectedRoute><Map /></ProtectedRoute>} />
            <Route path="/post" element={<ProtectedRoute><PostPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/location/:id" element={<ProtectedRoute><LocationDetailPage /></ProtectedRoute>} />
            <Route path="/location-detail" element={<ProtectedRoute><LocationDetailPage /></ProtectedRoute>} />
            <Route path="/favorites" element={<ProtectedRoute><Favorite /></ProtectedRoute>} /> 
            <Route path="/my-posts" element={<ProtectedRoute><MyPost /></ProtectedRoute>} />
            <Route path="/video-history" element={<ProtectedRoute><VideoHistory /></ProtectedRoute>} />
            <Route path="/video-page" element={<ProtectedRoute><VideoPage /></ProtectedRoute>} />
            <Route path="/video-review" element={<ProtectedRoute><VideoReview /></ProtectedRoute>} />
            {/* Default Route */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
