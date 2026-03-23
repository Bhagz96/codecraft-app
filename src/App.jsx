import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LessonPage from "./pages/LessonPage";
import RewardPage from "./pages/RewardPage";
import AdminDashboard from "./pages/AdminDashboard";

/**
 * APP COMPONENT
 * =============
 * This is the top-level component that sets up page routing.
 *
 * Routes:
 *   /              → Home page (lesson picker)
 *   /lesson/:id    → Lesson player (the main learning experience)
 *   /reward        → Reward screen (shown after completing a lesson)
 *   /admin         → Admin dashboard (shows MAB analytics)
 */
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-purple-50 to-pink-100">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lesson/:lessonId" element={<LessonPage />} />
          <Route path="/reward" element={<RewardPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
