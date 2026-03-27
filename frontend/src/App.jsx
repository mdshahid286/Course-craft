import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CourseBuilderPage from './pages/CourseBuilderPage';
import CourseViewPage from './pages/CourseViewPage';
import QuizPage from './pages/QuizPage';
import CoursesPage from './pages/CoursesPage';
import SettingsPage from './pages/SettingsPage';
import Layout from './components/Layout';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          {/* Dashboard and related pages are wrapped in the Playroom Layout */}
          <Route path="/" element={<Layout><DashboardPage /></Layout>} />
          <Route path="/courses" element={<Layout><CoursesPage /></Layout>} />
          <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
          
          <Route path="/build" element={<Layout><CourseBuilderPage /></Layout>} />
          <Route path="/course/:courseId" element={<Layout><CourseViewPage /></Layout>} /> 
          <Route path="/lesson/:lessonId/practice" element={<Layout><QuizPage /></Layout>} />
          <Route path="/students" element={<Layout><div className="p-10 font-display text-2xl font-bold">Students Directory Coming Soon</div></Layout>} />
          <Route path="/insights" element={<Layout><div className="p-10 font-display text-2xl font-bold">Insights coming soon</div></Layout>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
