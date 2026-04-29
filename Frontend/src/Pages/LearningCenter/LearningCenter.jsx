import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllVideosAction } from "@/redux/features/course/courseAction";

const LearningCenter = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 🔥 COURSE STATE FROM REDUX
  const { courses, loading: courseLoading } = useSelector(
    (state) => state.course
  );

  // 🔴 LIVE STATE (UNCHANGED)
  const [liveRooms, setLiveRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const prevDataRef = useRef([]);

  // 🔥 FETCH COURSES
  useEffect(() => {
    dispatch(getAllVideosAction());
  }, [dispatch]);

  // 🔴 LIVE FETCH (UNCHANGED)
  useEffect(() => {
    const fetchLiveRooms = async () => {
      try {
        if (prevDataRef.current.length === 0) {
          setLoading(true);
        }

        setError(null);

        const res = await fetch("http://localhost:8080/api/live");

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        const newData = Array.isArray(data) ? data : [];

        if (prevDataRef.current.length === 0) {
          prevDataRef.current = newData;
          setLiveRooms(newData);
        } else {
          const isSame =
            prevDataRef.current.length === newData.length &&
            prevDataRef.current.every(
              (item, i) => item.roomId === newData[i]?.roomId
            );

          if (!isSame) {
            prevDataRef.current = newData;
            setLiveRooms(newData);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveRooms();
    const interval = setInterval(fetchLiveRooms, 15000);
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
          <h3 className="text-2xl font-bold mb-6 text-red-600">🔴 Live Now</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveRooms.map((live) => (
              <div
                key={live.roomId}
                onClick={() => navigate(`/live/${live.roomId}`)}
                className="relative rounded-xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition"
              >
                <img
                  src={
                    live.image ||
                    "https://via.placeholder.com/400x200?text=Live+Session"
                  }
                  alt={live.title || "Live session"}
                  className="h-52 w-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition" />
                <div className="absolute top-3 left-3 bg-red-600 text-white text-xs px-3 py-1 rounded-full">
                  🔴 LIVE
                </div>
                <div className="absolute bottom-0 p-4 text-white bg-gradient-to-t from-black/80">
                  <h4 className="font-bold">{live.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* COURSE GRID */}
      <div>
        <h3 className="text-2xl font-bold mb-6">Popular Courses</h3>

        {courseLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 h-56 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow hover:shadow-xl transition cursor-pointer group overflow-hidden"
              >
                <img
                  src={course.thumbnail}
                  alt={course.courseTitle}
                  className="h-40 w-full object-cover group-hover:scale-110 transition"
                />

                <div className="p-4">
                  <h3 className="font-bold mb-2">
                    {course.courseTitle}
                  </h3>

                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{course.tags?.[0]}</span>
                    <span>{course.videoTitle}</span>
                  </div>

                  <button
                    onClick={() =>
                      navigate(`/course/${course.videoId}`)
                    }
                    className="mt-3 text-blue-600 font-semibold"
                  >
                    Start Learning →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningCenter;