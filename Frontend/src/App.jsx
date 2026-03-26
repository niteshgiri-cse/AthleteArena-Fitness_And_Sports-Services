import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
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
import Footer from "./components/layout/Footer";
import Auth from "./Pages/Auth/Auth";
import Services from "./Pages/Services/Services";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/sport-category" element={<SportsCategories />} />
        <Route path="/community" element={<Community />} />
        <Route path="/recent-new" element={<RecentNews />} />
        <Route path="/live-events" element={<Event />} />
        <Route path="/services" element={<Services />} />

        <Route path="/learning-center" element={<LearningCenter />} />
        <Route path="/athlete-blogs" element={<AthleteBlogs />} />
        <Route path="/training-guides" element={<TrainingGuides />} />

        <Route path="/userProfile" element={<UserProfile />} />
        <Route path="/auth" element={<Auth/>}/>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}
