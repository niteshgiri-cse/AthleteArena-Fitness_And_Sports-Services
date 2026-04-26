import React, { useState } from "react";
import { useParams } from "react-router-dom";

const courseData = {
  1: {
    title: "Football Training Course",
    videos: [
      { id: 1, title: "Introduction", youtubeId: "dQw4w9WgXcQ" },
      { id: 2, title: "Warmup Training", youtubeId: "3JZ_D3ELwOQ" },
      { id: 3, title: "Dribbling Skills", youtubeId: "LXb3EKWsInQ" },
    ],
  },
  2: {
    title: "Gym Training",
    videos: [
      { id: 1, title: "Chest Workout", youtubeId: "eX2qFMC8cFo" },
      { id: 2, title: "Leg Day", youtubeId: "UItWltVZZmE" },
    ],
  },
};

const CoursePlayer = () => {
  const { id } = useParams();
  const course = courseData[id] || courseData[1];

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentVideo = course.videos[currentIndex];

  return (
    <div className="flex h-screen bg-gray-100 text-gray-900">

      {/* 🔥 SIDEBAR (LEFT) */}
      <div className="w-80 bg-white border-r shadow-sm flex flex-col">

        {/* HEADER */}
        <div className="p-5 border-b">
          <h2 className="text-lg font-semibold">{course.title}</h2>
          <p className="text-sm text-gray-500">
            {course.videos.length} lessons
          </p>
        </div>

        {/* VIDEO LIST */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {course.videos.map((video, index) => (
            <div
              key={video.id}
              onClick={() => setCurrentIndex(index)}
              className={`flex gap-3 p-3 rounded-lg cursor-pointer transition ${
                index === currentIndex
                  ? "bg-blue-50 border border-blue-200"
                  : "hover:bg-gray-100"
              }`}
            >
              <img
                src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                className="w-28 h-16 object-cover rounded-md"
              />

              <div className="flex flex-col justify-between">
                <p className="text-sm font-medium line-clamp-2">
                  {video.title}
                </p>
                <span className="text-xs text-gray-400">
                  Lesson {index + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 MAIN VIDEO AREA */}
      <div className="flex-1 flex flex-col">

        {/* TOP BAR */}
        <div className="px-6 py-4 bg-white border-b flex justify-between items-center">
          <h1 className="text-lg font-semibold">
            {currentVideo.title}
          </h1>
          <span className="text-sm text-gray-500">
            Lesson {currentIndex + 1}/{course.videos.length}
          </span>
        </div>

        {/* 🎥 VIDEO FULL SIZE FIXED */}
        <div className="flex-1 bg-black">

          <iframe
            key={currentVideo.youtubeId}
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${currentVideo.youtubeId}?autoplay=1&rel=0`}
            allow="autoplay; encrypted-media"
            allowFullScreen
          />

        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 bg-white border-t">
          <h2 className="font-semibold">{currentVideo.title}</h2>
          <p className="text-sm text-gray-500 mt-1">
            Keep learning and complete the course.
          </p>
        </div>

      </div>
    </div>
  );
};

export default CoursePlayer;