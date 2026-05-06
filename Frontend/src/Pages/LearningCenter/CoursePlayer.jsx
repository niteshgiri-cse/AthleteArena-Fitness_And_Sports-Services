import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getAllVideosAction } from "@/redux/features/course/courseAction";

const CoursePlayer = () => {

  const { id } = useParams();

  const dispatch = useDispatch();

  const {
    courses,
    loading,
  } = useSelector(
    (state) => state.course
  );

  // ================= FETCH VIDEOS =================

  useEffect(() => {

    dispatch(getAllVideosAction());

  }, [dispatch]);

  // ================= CURRENT VIDEO =================

  const [currentVideo, setCurrentVideo] =
    useState(null);

  // ================= SET SELECTED VIDEO =================

  useEffect(() => {

    if (
      courses &&
      courses.length > 0
    ) {

      const selected =
        courses.find(
          (item) =>
            String(item.videoId) ===
            String(id)
        );

      setCurrentVideo(
        selected || courses[0]
      );
    }

  }, [courses, id]);

  // ================= YOUTUBE ID FIX =================

  const getYoutubeId = (url) => {

    if (!url) return "";

    try {

      // FULL YOUTUBE URL
      if (
        url.includes(
          "youtube.com"
        )
      ) {

        const parsed =
          new URL(url);

        return parsed.searchParams.get(
          "v"
        );
      }

      // SHORT URL
      if (
        url.includes(
          "youtu.be/"
        )
      ) {

        return url.split(
          "youtu.be/"
        )[1];
      }

      // already video ID
      return url;

    } catch (err) {

      return url;
    }
  };

  // ================= LOADING =================

  if (
    loading ||
    !currentVideo
  ) {

    return (
      <div className="h-screen flex items-center justify-center text-2xl font-bold">

        Loading...

      </div>
    );
  }

  // ================= RELATED VIDEOS =================

  const relatedVideos =
    courses.filter(
      (item) =>
        item.id !==
        currentVideo.id
    );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">

      {/* ================= VIDEO PLAYER ================= */}

      <div className="order-1 md:order-2 flex flex-col flex-1">

        {/* TOPBAR */}
        <div className="px-4 md:px-6 py-4 bg-white border-b flex justify-between items-center shadow-sm">

          <h1 className="text-sm md:text-2xl font-bold truncate">

            {
              currentVideo.courseTitle
            }

          </h1>

          <span className="text-xs md:text-sm text-gray-500 font-medium">

            Training Video

          </span>
        </div>

        {/* VIDEO */}
        <div className="bg-black w-full h-[240px] sm:h-[340px] md:h-[78vh]">

          <iframe
            key={
              currentVideo.videoLink
            }
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${getYoutubeId(
              currentVideo.videoLink
            )}?autoplay=1&modestbranding=1&rel=0`}
            title={
              currentVideo.videoTitle
            }
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />

        </div>

        {/* INFO */}
        <div className="px-4 md:px-6 py-5 bg-white border-t">

          <h2 className="font-bold text-xl">

            {
              currentVideo.videoTitle
            }

          </h2>

          <p className="text-gray-500 text-sm mt-2 leading-relaxed">

            {
              currentVideo.courseTitle
            }

          </p>

          {/* TAGS */}
          <div className="flex flex-wrap gap-3 mt-4">

            {currentVideo.tags?.map(
              (tag, index) => (

                <span
                  key={index}
                  className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-xs font-semibold"
                >

                  {tag}

                </span>
              )
            )}
          </div>
        </div>
      </div>

      {/* ================= SIDEBAR ================= */}

      <div className="order-2 md:order-1 w-full md:w-[380px] bg-white border-t md:border-t-0 md:border-r shadow-sm">

        {/* HEADER */}
        <div className="p-5 border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white">

          <h2 className="text-xl md:text-2xl font-bold">

            More Videos

          </h2>

          <p className="text-sm text-blue-100 mt-1">

            {
              courses.length
            } lessons available

          </p>
        </div>

        {/* VIDEO LIST */}
        <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-100px)]">

          {/* CURRENT VIDEO */}
          <div
            className="flex gap-3 p-3 rounded-2xl border bg-blue-50 border-blue-400 shadow-md"
          >

            {/* IMAGE */}
            <div className="relative">

              <img
                src={
                  currentVideo.thumbnail ||
                  `https://img.youtube.com/vi/${getYoutubeId(
                    currentVideo.videoLink
                  )}/mqdefault.jpg`
                }
                className="w-28 h-16 object-cover rounded-xl"
                alt=""
              />

              <div className="absolute inset-0 flex items-center justify-center">

                <div className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center">

                  <span className="text-white text-sm ml-0.5">

                    ▶

                  </span>
                </div>
              </div>
            </div>

            {/* TEXT */}
            <div className="flex flex-col justify-between flex-1">

              <p className="text-sm font-semibold line-clamp-2 text-blue-700">

                {
                  currentVideo.videoTitle
                }

              </p>

              <span className="text-xs text-gray-400">

                Currently Playing

              </span>
            </div>
          </div>

          {/* RELATED VIDEOS */}
          {relatedVideos.map(
            (video, index) => (

              <div
                key={
                  video.videoId ||
                  index
                }
                onClick={() =>
                  setCurrentVideo(video)
                }
                className="flex gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-300 border bg-white hover:bg-gray-50 border-gray-200"
              >

                {/* THUMB */}
                <div className="relative">

                  <img
                    src={
                      video.thumbnail ||
                      `https://img.youtube.com/vi/${getYoutubeId(
                        video.videoLink
                      )}/mqdefault.jpg`
                    }
                    className="w-28 h-16 object-cover rounded-xl"
                    alt=""
                  />

                  <div className="absolute inset-0 flex items-center justify-center">

                    <div className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center">

                      <span className="text-white text-sm ml-0.5">

                        ▶

                      </span>
                    </div>
                  </div>
                </div>

                {/* TEXT */}
                <div className="flex flex-col justify-between flex-1">

                  <p className="text-sm font-semibold line-clamp-2 text-gray-800">

                    {
                      video.videoTitle
                    }

                  </p>

                  <span className="text-xs text-gray-400">

                    Lesson {index + 2}

                  </span>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;