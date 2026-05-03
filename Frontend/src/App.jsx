import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import MainLayout from "./components/layout/MainLayout";
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

import Home from "./Pages/Home/Home";
import Auth from "./Pages/Auth/Auth";

import SportsCategories from "./Pages/Cotegory/SportsCategories";
import Community from "./Pages/Community/Community";
import RecentNews from "./Pages/RecentNews/RecentNews";
import Event from "./Pages/Events/Events";
import Services from "./Pages/Services/Services";
import LearningCenter from "./Pages/LearningCenter/LearningCenter";
import AthleteBlogs from "./Pages/BlogCenter/AthleteBlogs";
import TrainingGuides from "./Pages/TrainingGuides/TrainingGuides";

import Dashboard from "./Pages/Admin/Dashboard";
import { AdminNotification } from "./Pages/Admin/AdminNotification";
import RegisterEvent from "./Pages/Admin/RegisterEvent";
import ManageUsers from "./Pages/Admin/ManageUsers";
import Reports from "./Pages/Admin/Reports";

import PageNotFound from "./Pages/NotFound/PageNotFound";
import UserProfile from "./Pages/UserProfile/UserProfile";
import GoLive from "./Pages/GoLive/GoLive";
import AdminUpload from "./Pages/Admin/AdminUpload";
import CoursePlayer from "./Pages/LearningCenter/CoursePlayer";

export default function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>

        {/* 🔓 PUBLIC */}
        <Route path="/auth" element={<Auth />} />

        {/* 🌐 MAIN LAYOUT (NAVBAR + FOOTER) */}
        <Route element={<MainLayout />}>

          {/* ✅ HOME (PUBLIC + NAVBAR) */}
          <Route path="/" element={<Home />} />

          {/* 🔐 PROTECTED (USER + ADMIN) */}
          <Route element={<ProtectedRoute allowedRoles={["USER", "ADMIN"]} />}>

            <Route path="/userProfile" element={<UserProfile />} />
            <Route path="/sport-category" element={<SportsCategories />} />
            <Route path="/community" element={<Community />} />
            <Route path="/recent-new" element={<RecentNews />} />
            <Route path="/live-events" element={<Event />} />
            <Route path="/services" element={<Services />} />
            <Route path="/live-learning" element={<LearningCenter />} />
            <Route path="/athlete-blogs" element={<AthleteBlogs />} />
            <Route path="/training-guides" element={<TrainingGuides />} />

          </Route>
        </Route>

        {/* 🎥 FULLSCREEN (NO NAVBAR / FOOTER) */}
        <Route element={<ProtectedRoute allowedRoles={["USER", "ADMIN"]} />}>
          <Route path="/course/:id" element={<CoursePlayer />} />
          <Route path="/live/:roomId" element={<GoLive />} />
        </Route>

        {/* 🛠 ADMIN (NO NAVBAR / FOOTER) */}
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="notification" element={<AdminNotification />} />
            <Route path="register-event" element={<RegisterEvent />} />
            <Route path="bookings" element={<ManageUsers />} />
            <Route path="reports" element={<Reports />} />
            <Route path="upload-course" element={<AdminUpload />} />
          </Route>
        </Route>

        {/* ❌ 404 */}
        <Route path="*" element={<PageNotFound />} />

      </Routes>
    </>
  );
}