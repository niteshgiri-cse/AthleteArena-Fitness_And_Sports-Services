import React, { useState } from "react";
import { useParams } from "react-router-dom";

const courseData = {
  1: {
    title: "Football Training Course",
    videos: [
      { id: 1, title: "Introduction", youtubeId: "j-NhORwJDb4" },
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
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">

      {/* 🎥 VIDEO SECTION (TOP IN MOBILE) */}
      <div className="order-1 md:order-2 flex flex-col flex-1">

        <div className="px-4 md:px-6 py-3 bg-white border-b flex justify-between items-center">
          <h1 className="text-sm md:text-lg font-semibold truncate">
            {currentVideo.title}
          </h1>
          <span className="text-xs md:text-sm text-gray-500">
            {currentIndex + 1}/{course.videos.length}
          </span>
        </div>

        <div className="bg-black w-full h-[220px] sm:h-[300px] md:h-[75vh]">
          <iframe
            key={currentVideo.youtubeId}
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${currentVideo.youtubeId}?rel=0`}
            allow="encrypted-media"
            allowFullScreen
          />
        </div>

        <div className="px-4 md:px-6 py-3 bg-white border-t text-sm">
          <h2 className="font-semibold">{currentVideo.title}</h2>
          <p className="text-gray-500 text-xs mt-1">
            Keep learning and complete the course.
          </p>
        </div>

      </div>

      {/* 📚 SIDEBAR (BOTTOM IN MOBILE, LEFT IN DESKTOP) */}
      <div className="order-2 md:order-1 w-full md:w-96 bg-white border-t md:border-t-0 md:border-r">

        <div className="p-4 border-b">
          <h2 className="text-base md:text-lg font-semibold">
            {course.title}
          </h2>
          <p className="text-xs md:text-sm text-gray-500">
            {course.videos.length} lessons
          </p>
        </div>

        <div className="p-3 space-y-3">
          {course.videos.map((video, index) => (
            <div
              key={video.id}
              onClick={() => setCurrentIndex(index)}
              className={`flex gap-3 p-3 rounded-lg cursor-pointer ${
                index === currentIndex
                  ? "bg-blue-50 border border-blue-200"
                  : "hover:bg-gray-100"
              }`}
            >
              <img
                src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                className="w-24 h-14 object-cover rounded"
                alt=""
              />

              <div className="flex flex-col justify-between">
                <p className="text-xs md:text-sm font-semibold line-clamp-2">
                  {video.title}
                </p>
                <span className="text-[10px] md:text-xs text-gray-400">
                  Lesson {index + 1}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};

export default CoursePlayer;