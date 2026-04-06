import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import LessonPage from "./pages/LessonPage";
import RewardPage from "./pages/RewardPage";
import AdminDashboard from "./pages/AdminDashboard";
import LoginPage from "./pages/LoginPage";
import SkillLevelPage from "./pages/SkillLevelPage";

/**
 * Redirects unauthenticated users to /login.
 * Authenticated users without a skill level are sent to /skill-level first.
 * Pass requiresSkillLevel={false} to skip the skill level check (used on /skill-level itself).
 */
function ProtectedRoute({ children, requiresSkillLevel = true }) {
  const { user, isGuest, isAdmin, skillLevel, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user && !isGuest) return <Navigate to="/login" replace />;
  if (requiresSkillLevel && user && !isAdmin && !skillLevel) return <Navigate to="/skill-level" replace />;
  return children;
}

/**
 * Admin-only route — redirects non-admins to home.
 */
function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

/**
 * Sends admin users straight to /admin when they land on /.
 */
function AdminRedirect({ children }) {
  const { isAdmin } = useAuth();
  if (isAdmin) return <Navigate to="/admin" replace />;
  return children;
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117]">
      <p className="text-cyan-400 font-mono animate-pulse">Loading...</p>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/skill-level" element={<ProtectedRoute requiresSkillLevel={false}><SkillLevelPage /></ProtectedRoute>} />
      <Route path="/" element={<ProtectedRoute><AdminRedirect><HomePage /></AdminRedirect></ProtectedRoute>} />
      <Route path="/lesson/:conceptId/:level" element={<ProtectedRoute><LessonPage /></ProtectedRoute>} />
      <Route path="/reward" element={<ProtectedRoute><RewardPage /></ProtectedRoute>} />
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-[#0d1117] text-gray-100">
          <AppRoutes />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
