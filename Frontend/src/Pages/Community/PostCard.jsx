import { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

export default function PostCard({ post }) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (post.mediaType === "VIDEO" && videoRef.current && !playerRef.current) {
      playerRef.current = videojs(videoRef.current, {
        controls: true,
        responsive: true,
        fluid: true,
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [post.mediaType]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

      {/* USER */}
      <div className="p-3 font-semibold text-sm">
        {post.username}
      </div>

      {/* MEDIA */}
      {post.mediaType === "IMAGE" && (
        <img src={post.url} className="w-full" />
      )}

      {post.mediaType === "VIDEO" && (
        <div data-vjs-player>
          <video
            ref={videoRef}
            className="video-js vjs-big-play-centered"
          >
            <source src={post.url} type="video/mp4" />
          </video>
        </div>
      )}

      {/* CONTENT */}
      <div className="p-3 space-y-2">
        <p className="text-sm font-medium">{post.title}</p>

        <div className="flex gap-5 text-sm text-gray-600">
          <span>❤️ {post.likeCount}</span>
          <span>💬 {post.commentCount}</span>
        </div>
      </div>
    </div>
  );
}