import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const courses = [
  {
    id: 1,
    title: "Football Dribbling Masterclass",
    level: "Beginner",
    duration: "3h 20m",
    image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800",
  },
  {
    id: 2,
    title: "Strength Training for Athletes",
    level: "Intermediate",
    duration: "5h 10m",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800",
  },
  {
    id: 3,
    title: "Professional Cricket Batting Techniques",
    level: "Advanced",
    duration: "4h 45m",
    image: "https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=800",
  },
  {
    id: 4,
    title: "Speed & Agility Training",
    level: "All Levels",
    duration: "2h 30m",
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800",
  },
];

const LearningCenter = () => {
  const navigate = useNavigate();
  const [liveRooms, setLiveRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLiveRooms = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("http://localhost:8080/api/live");

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setLiveRooms(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
        setLiveRooms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveRooms();
    const interval = setInterval(fetchLiveRooms, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-14">

      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-bold">Learning Hub</h2>
        <button className="text-blue-600 font-semibold hover:underline">
          View All Courses
        </button>
      </div>

      {/* 🔴 LIVE SECTION */}
      {!loading && !error && liveRooms.length > 0 && (
        <div className="mb-14">
          <h3 className="text-2xl font-bold mb-6 text-red-600">
            🔴 Live Now
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveRooms.map((live) => (
              <div
                key={live.roomId}
                onClick={() => navigate(`/live/${live.roomId}`)}
                className="relative rounded-xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition"
              >
                <img
                  src={live.image || "https://via.placeholder.com/400x200?text=Live+Session"}
                  alt={live.title || "Live session"}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x200?text=Live+Session";
                  }}
                  className="h-52 w-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition" />
                <div className="absolute top-3 left-3 bg-red-600 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 z-10">
                  <span className="animate-pulse">🔴</span> LIVE
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white bg-gradient-to-t from-black/80 to-transparent">
                  <h4 className="font-bold text-lg">{live.title || "Live Session"}</h4>
                  <p className="text-sm">{live.host || "Host"}</p>
                  <p className="text-xs opacity-80">{live.viewers || 0} watching</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Course Grid */}
      <div>
        <h3 className="text-2xl font-bold mb-6">Popular Courses</h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (

            /* ✅ 🔥 THIS IS THE ONLY IMPORTANT CHANGE */
            <div
              key={course.id}
              onClick={() => navigate(`/course/${course.id}`)}
              className="bg-white rounded-xl shadow hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
            >
              <div className="overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="rounded-t-xl h-40 w-full object-cover group-hover:scale-110 transition duration-500"
                />
              </div>

              <div className="p-4">
                <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">
                  {course.title}
                </h3>

                <div className="flex justify-between text-sm text-gray-500">
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                    {course.level}
                  </span>

                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {course.duration}
                  </span>
                </div>

                {/* button normal hi rakha */}
                <button className="mt-4 text-blue-600 font-semibold">
                  Start Learning →
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default LearningCenter;