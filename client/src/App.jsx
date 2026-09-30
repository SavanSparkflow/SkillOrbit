import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import LearningRoom from './pages/LearningRoom';
import Dashboard from './pages/Dashboard';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import VerifyCertificate from './pages/VerifyCertificate';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Teacher Pages
import TeacherDashboard from './pages/Teacher/TeacherDashboard';
import CreateCourse from './pages/Teacher/CreateCourse';
import ManageCurriculum from './pages/Teacher/ManageCurriculum';

// Legal & Info Pages
import AboutUs from './pages/Legal/AboutUs';
import ContactUs from './pages/Legal/ContactUs';
import PrivacyPolicy from './pages/Legal/PrivacyPolicy';
import TermsOfService from './pages/Legal/TermsOfService';
import RefundPolicy from './pages/Legal/RefundPolicy';

function App() {
  const { fetchUser } = useAuthStore();
  const { initTheme } = useThemeStore();
  const location = useLocation();

  useEffect(() => {
    initTheme();
    fetchUser();
  }, [initTheme, fetchUser]);

  // Hide general Navbar and Footer on the immersive LMS classroom player route
  const isClassroom = location.pathname.startsWith('/learn/');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {!isClassroom && <Navbar />}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/learn/:courseId" element={<LearningRoom />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/verify-certificate/:certificateId" element={<VerifyCertificate />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Teacher Portal */}
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/teacher/create-course" element={<CreateCourse />} />
          <Route path="/teacher/curriculum/:courseId" element={<ManageCurriculum />} />

          {/* Legal / Policy Pages */}
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/refund" element={<RefundPolicy />} />
        </Routes>
      </main>

      {!isClassroom && <Footer />}
    </div>
  );
}

export default App;
