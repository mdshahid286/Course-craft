// Force dev server refresh - cache bypass v2
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CourseBuilderPage from './pages/CourseBuilderPage';
import CourseViewPage from './pages/CourseViewPage';
import QuizPage from './pages/QuizPage';
import CoursesPage from './pages/CoursesPage';
import SettingsPage from './pages/SettingsPage';
import CommunityPage from './pages/CommunityPage';
import AnalyticsPage from './pages/AnalyticsPage';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Dashboard and related pages are wrapped in the Playroom Layout */}
          <Route path="/dashboard" element={<ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute>} />
          <Route path="/courses" element={<ProtectedRoute><Layout><CoursesPage /></Layout></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Layout><SettingsPage /></Layout></ProtectedRoute>} />
          
          <Route path="/build" element={<ProtectedRoute><Layout><CourseBuilderPage /></Layout></ProtectedRoute>} />
          <Route path="/course/:courseId" element={<ProtectedRoute><Layout><CourseViewPage /></Layout></ProtectedRoute>} /> 
          <Route path="/lesson/:lessonId/practice" element={<ProtectedRoute><Layout><QuizPage /></Layout></ProtectedRoute>} />
          <Route path="/community" element={<ProtectedRoute><Layout><CommunityPage /></Layout></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Layout><AnalyticsPage /></Layout></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
