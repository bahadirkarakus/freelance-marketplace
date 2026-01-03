import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import CreateProject from './pages/CreateProject';
import Freelancers from './pages/Freelancers';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import Chat from './pages/Chat';
import FreelancerProfile from './pages/FreelancerProfile';
import MyBids from './pages/MyBids';
import CategoryDetail from './pages/CategoryDetail';
import ComponentShowcase from './pages/ComponentShowcase';
import HowItWorksHiring from './pages/HowItWorksHiring';
import HowItWorksFreelancer from './pages/HowItWorksFreelancer';
import AdminPanel from './pages/AdminPanel';
import Portfolio from './pages/Portfolio';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Toaster position="top-right" />
            <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/category/:category" element={<CategoryDetail />} />
            <Route path="/components" element={<ComponentShowcase />} />
            <Route path="/how-it-works/hiring" element={<HowItWorksHiring />} />
            <Route path="/how-it-works/freelancer" element={<HowItWorksFreelancer />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            
            {/* Protected Routes */}
            <Route path="/projects/create" element={
              <ProtectedRoute requiredRole="client">
                <CreateProject />
              </ProtectedRoute>
            } />
            
            <Route path="/freelancers" element={<Freelancers />} />
            <Route path="/freelancers/:id" element={<FreelancerProfile />} />
            
            <Route path="/my-bids" element={
              <ProtectedRoute requiredRole="freelancer">
                <MyBids />
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            <Route path="/messages" element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            } />
            
            <Route path="/chat/:userId" element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            } />
            
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            } />
            
            <Route path="/portfolio" element={
              <ProtectedRoute>
                <Portfolio />
              </ProtectedRoute>
            } />
            
            <Route path="/portfolio/:userId" element={<Portfolio />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
