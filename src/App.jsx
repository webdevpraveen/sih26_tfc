import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Timeline from './pages/Timeline';
import Teams from './pages/Teams';
import Slots from './pages/Slots';
import Notices from './pages/Notices';
import Results from './pages/Results';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageNotices from './pages/admin/ManageNotices';
import ManageTeams from './pages/admin/ManageTeams';
import ManageTimeline from './pages/admin/ManageTimeline';
import ManageSlots from './pages/admin/ManageSlots';
import SeedSlots from './pages/admin/SeedSlots';

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/timeline" element={<PublicLayout><Timeline /></PublicLayout>} />
          <Route path="/teams" element={<PublicLayout><Teams /></PublicLayout>} />
          <Route path="/slots" element={<PublicLayout><Slots /></PublicLayout>} />
          <Route path="/notices" element={<PublicLayout><Notices /></PublicLayout>} />
          <Route path="/results" element={<PublicLayout><Results /></PublicLayout>} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="notices" element={<ManageNotices />} />
            <Route path="teams" element={<ManageTeams />} />
            <Route path="timeline" element={<ManageTimeline />} />
            <Route path="slots" element={<ManageSlots />} />
            <Route path="seed-slots" element={<SeedSlots />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={
            <PublicLayout>
              <div style={{ 
                minHeight: '60vh', display: 'flex', flexDirection: 'column', 
                alignItems: 'center', justifyContent: 'center', paddingTop: 100 
              }}>
                <h1 style={{ fontSize: '4rem', fontFamily: 'var(--font-mono)', opacity: 0.3 }}>404</h1>
                <p style={{ color: 'var(--text-muted)', marginTop: 16 }}>Page not found</p>
              </div>
            </PublicLayout>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
