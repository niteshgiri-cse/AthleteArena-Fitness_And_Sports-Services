// App.jsx
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import SportsCategories from "./Pages/Cotegory/SportsCategories";
import Community from "./Pages/Community/Community";
import RecentNews from "./Pages/RecentNews/RecentNews";
import Event from "./Pages/Events/Events";
import LearningCenter from "./Pages/LearningCenter/LearningCenter";
import AthleteBlogs from "./Pages/BlogCenter/AthleteBlogs";
import TrainingGuides from "./Pages/TrainingGuides/TrainingGuides";
import UserProfile from "./Pages/UserProfile/UserProfile";
import PageNotFound from "./Pages/NotFound/PageNotFound";
import Home from "./Pages/Home/Home";
import Auth from "./Pages/Auth/Auth";
import Services from "./Pages/Services/Services";

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";

export default function App() {
  const location = useLocation();
  const hideLayout = location.pathname.startsWith("/auth");

  return (
    <>
      {!hideLayout && <Navbar />}
      <ToastContainer position="top-right" autoClose={3000} />
     <Routes>
  {/* Public */}
  <Route path="/" element={<Home />} />
  <Route path="/auth" element={<Auth />} />

  {/* 🔒 Protected group */}
  <Route element={<ProtectedRoute />}>
    <Route path="/userProfile" element={<UserProfile />} />
    <Route path="/sport-category" element={<SportsCategories />} />
    <Route path="/community" element={<Community />} />
    <Route path="/recent-new" element={<RecentNews />} />
    <Route path="/live-events" element={<Event />} />
    <Route path="/services" element={<Services />} />
    <Route path="/learning-center" element={<LearningCenter />} />
    <Route path="/athlete-blogs" element={<AthleteBlogs />} />
    <Route path="/training-guides" element={<TrainingGuides />} />
  </Route>

  <Route path="*" element={<PageNotFound />} />
</Routes>
      {!hideLayout && <Footer />}
    </>
  );
}