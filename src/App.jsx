import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LessonPage from "./pages/LessonPage";
import RewardPage from "./pages/RewardPage";
import AdminDashboard from "./pages/AdminDashboard";

/**
 * APP COMPONENT — Version 2
 * =========================
 * Top-level component that sets up page routing.
 *
 * Routes:
 *   /                              → Home page (concept picker with progress)
 *   /lesson/:conceptId/:level      → Lesson player (specific concept + level)
 *   /reward                        → Reward screen (shown after completing a lesson)
 *   /admin                         → Admin dashboard (MAB analytics)
 */
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0d1117] text-gray-100">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lesson/:conceptId/:level" element={<LessonPage />} />
          <Route path="/reward" element={<RewardPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
