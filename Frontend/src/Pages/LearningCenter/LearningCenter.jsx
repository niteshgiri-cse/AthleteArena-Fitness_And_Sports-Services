import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllVideosAction } from "@/redux/features/course/courseAction";

const LearningCenter = () => {

  const navigate = useNavigate();

  const dispatch = useDispatch();

  // ================= COURSE STATE =================

  const {
    courses,
    loading: courseLoading,
  } = useSelector(
    (state) => state.course
  );

  // ================= LIVE STATE =================

  const [liveRooms, setLiveRooms] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  const prevDataRef =
    useRef([]);

  // ================= FETCH COURSES =================

  useEffect(() => {

    dispatch(getAllVideosAction());

  }, [dispatch]);

  // ================= FETCH LIVE =================

  useEffect(() => {

    const fetchLiveRooms =
      async () => {

        try {

          if (
            prevDataRef.current
              .length === 0
          ) {
            setLoading(true);
          }

          setError(null);

          const res = await fetch(
            "http://localhost:8080/api/live"
          );

          if (!res.ok) {

            throw new Error(
              `HTTP error! status: ${res.status}`
            );
          }

          const data =
            await res.json();

          const newData =
            Array.isArray(data)
              ? data
              : [];

          if (
            prevDataRef.current
              .length === 0
          ) {

            prevDataRef.current =
              newData;

            setLiveRooms(newData);

          } else {

            const isSame =
              prevDataRef.current
                .length ===
                newData.length &&
              prevDataRef.current.every(
                (item, i) =>
                  item.roomId ===
                  newData[i]?.roomId
              );

            if (!isSame) {

              prevDataRef.current =
                newData;

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

    const interval =
      setInterval(
        fetchLiveRooms,
        15000
      );

    return () =>
      clearInterval(interval);

  }, []);

  // ================= UI =================

  return (
    <div className="max-w-[1500px] mx-auto px-4 md:px-6 lg:px-8 py-10">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">

        <div>

          <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">

            Learning Hub

          </h2>

          <p className="text-gray-500 mt-2 text-sm md:text-lg">

            Learn from professional athletes & trainers

          </p>

        </div>

        <button className="text-blue-600 font-bold text-sm md:text-lg hover:underline">

          View All Courses

        </button>
      </div>

      {/* ================= LIVE SECTION ================= */}

      {!loading &&
        !error &&
        liveRooms.length > 0 && (

        <div className="mb-12">

          {/* LIVE TITLE */}
          <div className="flex items-center gap-3 mb-6">

            <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse shadow-lg shadow-red-500/60" />

            <h3 className="text-3xl md:text-5xl font-black text-red-600 tracking-tight">

              Live Now

            </h3>
          </div>

          {/* LIVE CARD */}
          {liveRooms.map((live) => (

            <div
              key={live.roomId}
              onClick={() =>
                navigate(
                  `/live/${live.roomId}`
                )
              }
              className="relative h-[300px] md:h-[420px] lg:h-[520px] w-full rounded-[36px] overflow-hidden cursor-pointer group shadow-2xl"
            >

              {/* IMAGE */}
              <img
                src={
                  live.image ||
                  "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1400&auto=format&fit=crop"
                }
                alt={
                  live.title ||
                  "Live Session"
                }
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
              />

              {/* DARK OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-black/20" />

              {/* LIVE BADGE */}
              <div className="absolute top-5 md:top-8 left-5 md:left-8 flex items-center gap-2 bg-red-600 text-white text-xs md:text-base font-bold px-5 py-3 rounded-full shadow-xl">

                <span className="w-3 h-3 bg-white rounded-full animate-ping" />

                LIVE NOW

              </div>

              {/* VIEWERS */}
              <div className="absolute top-5 md:top-8 right-5 md:right-8 bg-black/50 backdrop-blur-xl border border-white/20 text-white text-xs md:text-base px-5 py-3 rounded-full font-semibold">

                👁 2.4k Watching

              </div>

              {/* CONTENT */}
              <div className="absolute inset-0 flex items-end">

                <div className="p-6 md:p-10 lg:p-14 text-white max-w-4xl">

                  {/* LABEL */}
                  <p className="uppercase tracking-[6px] text-red-300 text-xs md:text-sm font-bold mb-3">

                    LIVE TRAINING SESSION

                  </p>

                  {/* TITLE */}
                  <h4 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[0.95] mb-5">

                    {live.title ||
                      "Live Training Session"}

                  </h4>

                  {/* DESC */}
                  <p className="text-gray-200 text-sm md:text-lg lg:text-2xl leading-relaxed max-w-3xl">

                    Join the live interactive coaching session and learn advanced techniques from professional trainers in real time.

                  </p>

                  {/* BUTTON */}
                  <button className="mt-8 bg-red-600 hover:bg-red-700 text-white px-8 md:px-10 py-4 rounded-full text-base md:text-xl font-bold shadow-2xl transition-all duration-300 hover:scale-105">

                    Join Live Stream →

                  </button>

                </div>
              </div>
            </div>

          ))}
        </div>
      )}

      {/* ================= POPULAR COURSES ================= */}

      <div
        className={
          liveRooms.length > 0
            ? ""
            : "mt-2"
        }
      >

        {/* TITLE */}
        <div
          className={
            liveRooms.length > 0
              ? "mb-8"
              : "mb-10"
          }
        >

          <h3 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">

            Popular Courses

          </h3>

          <p className="text-gray-500 mt-2 text-sm md:text-lg">

            Premium sports learning content curated by experts

          </p>

        </div>

        {/* LOADING */}
        {courseLoading ? (

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

            {[1, 2, 3, 4].map(
              (i) => (

                <div
                  key={i}
                  className="bg-gray-200 h-[420px] rounded-[30px] animate-pulse"
                />

              )
            )}
          </div>

        ) : (

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

            {courses.map((course) => (

              <div
                key={course.id}
                className="bg-white rounded-[30px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group border border-gray-100 hover:-translate-y-1"
              >

                {/* IMAGE */}
                <div className="relative overflow-hidden">

                  <img
                    src={
                      course.thumbnail
                    }
                    alt={
                      course.courseTitle
                    }
                    className="h-[240px] w-full object-cover group-hover:scale-110 transition duration-700"
                  />

                  {/* TAG */}
                  <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-lg text-white text-xs font-bold px-4 py-2 rounded-full">

                    {
                      course.tags?.[0] ||
                      "SPORT"
                    }

                  </div>

                  {/* PLAY ICON */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-500">

                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/30">

                      <span className="text-white text-2xl ml-1">

                        ▶

                      </span>
                    </div>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-6">

                  {/* TITLE */}
                  <h3 className="font-black text-2xl text-gray-900 leading-snug mb-4 line-clamp-2 min-h-[64px]">

                    {course.courseTitle}

                  </h3>

                  {/* DESCRIPTION */}
                  <p className="text-gray-500 text-base leading-relaxed line-clamp-3 min-h-[78px]">

                    {
                      course.videoTitle
                    }

                  </p>

                  {/* FOOTER */}
                  <div className="flex items-center justify-between mt-6">

                    <div>

                      <p className="text-xs text-gray-400 uppercase tracking-wider">

                        Category

                      </p>

                      <p className="font-bold text-gray-800 text-sm md:text-base">

                        {
                          course.tags?.[0] ||
                          "SPORT"
                        }

                      </p>

                    </div>

                    {/* BUTTON */}
                    <button
                      onClick={() =>
                        navigate(
                          `/course/${course.videoId}`
                        )
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-full text-sm font-bold shadow-md transition-all duration-300 hover:scale-105"
                    >

                      Start →

                    </button>
                  </div>
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