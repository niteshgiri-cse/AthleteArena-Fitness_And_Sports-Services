import { useState, useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

import {
  toggleLike,
  getComments,
  addComment,
} from "@/api/mediaApi";

export default function PostCard({ post }) {

  const videoRef = useRef(null);
  const playerRef = useRef(null);

  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);

  const [text, setText] = useState("");

  const [liked, setLiked] = useState(
    post?.liked || false
  );

  const [likeCount, setLikeCount] = useState(
    post?.likeCount || 0
  );

  const [commentCount, setCommentCount] = useState(
    post?.commentCount || 0
  );

  const [expanded, setExpanded] = useState(false);

  // ================= VIDEO =================

  useEffect(() => {

    if (
      post?.mediaType === "VIDEO" &&
      videoRef.current
    ) {

      if (!playerRef.current) {

        playerRef.current = videojs(
          videoRef.current,
          {
            controls: true,
            autoplay: false,
            preload: "auto",
            fluid: true,
          }
        );
      }
    }

    return () => {

      if (playerRef.current) {

        playerRef.current.dispose();

        playerRef.current = null;
      }
    };

  }, [post]);

  // ================= COMMENTS =================

  const handleToggleComments = async () => {

    if (showComments) {
      setShowComments(false);
      return;
    }

    try {

      const res = await getComments(post.id);

      console.log("COMMENTS:", res);

      // ✅ FIXED
      const commentsData =
        Array.isArray(res) ? res : [];

      setComments(commentsData);

      setCommentCount(commentsData.length);

      setShowComments(true);

    } catch (err) {
      console.log(err);
    }
  };

  // ================= ADD COMMENT =================

  const handleComment = async () => {

    if (!text.trim()) return;

    try {

      // add comment
      await addComment(post.id, {
        text
      });

      // fetch updated comments
      const res = await getComments(post.id);

      // ✅ FIXED
      const updatedComments =
        Array.isArray(res) ? res : [];

      // instant UI update
      setComments(updatedComments);

      setCommentCount(updatedComments.length);

      setText("");

    } catch (err) {
      console.log(err);
    }
  };

  // ================= ENTER KEY =================

  const handleKeyDown = (e) => {

    if (e.key === "Enter") {

      e.preventDefault();

      handleComment();
    }
  };

  // ================= LIKE =================

  const handleLike = async () => {

    try {

      await toggleLike(post.id);

      // instant ui update
      setLiked((prev) => !prev);

      setLikeCount((prev) =>
        liked ? prev - 1 : prev + 1
      );

    } catch (err) {
      console.log(err);
    }
  };

  // ================= SAFETY =================

  if (!post) return null;

  // ================= UI =================

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">

      {/* HEADER */}
      <div className="flex gap-3 p-4">

        <img
          src={
            post.profileImageUrl ||
            `https://ui-avatars.com/api/?name=${post.username || "User"}`
          }
          alt="profile"
          className="w-10 h-10 rounded-full object-cover"
        />

        <div>

          <p className="font-semibold">
            {post.username}
          </p>

          <p className="text-xs text-gray-500">

            {post.createdAt
              ? new Date(post.createdAt).toLocaleString()
              : "Just now"}

          </p>
        </div>
      </div>

      {/* TEXT */}
      <div className="px-4 pb-3">

        <p className="font-semibold">
          {post.title}
        </p>

        <p className="text-sm text-gray-600">

          {expanded
            ? post.description
            : post.description?.slice(0, 120)}

          {post.description?.length > 120 && (

            <span
              onClick={() =>
                setExpanded(!expanded)
              }
              className="text-blue-500 cursor-pointer"
            >
              {expanded
                ? " show less"
                : "...see more"}
            </span>

          )}
        </p>
      </div>

      {/* IMAGE */}
      {post.mediaType === "IMAGE" && (

        <img
          src={post.url}
          alt={post.title}
          className="w-full max-h-[500px] object-cover"
        />

      )}

      {/* VIDEO */}
      {post.mediaType === "VIDEO" && (

        <div className="w-full bg-black">

          <video
            ref={videoRef}
            className="video-js vjs-big-play-centered w-full"
            controls
            preload="auto"
          >
            <source
              src={post.url}
              type="video/mp4"
            />
          </video>

        </div>

      )}

      {/* ACTIONS */}
      <div className="flex justify-between px-4 py-2 text-sm border-t">

        <span>
          👍 {likeCount}
        </span>

        <span>
          {commentCount} comments
        </span>

      </div>

      {/* BUTTONS */}
      <div className="flex justify-around border-t py-2 text-sm">

        <button
          onClick={handleLike}
        >
          {liked
            ? "❤️ Liked"
            : "🤍 Like"}
        </button>

        <button
          onClick={handleToggleComments}
        >
          💬 Comment
        </button>

      </div>

      {/* COMMENTS */}
      {showComments && (

        <div className="p-4 space-y-3 border-t bg-gray-50">

          {comments.length === 0 && (

            <p className="text-sm text-gray-400 text-center">
              No comments yet
            </p>

          )}

          {comments.map((c, index) => (

            <div
              key={c.id || index}
              className="flex gap-3"
            >

              <img
                src={
                  c.profileImageUrl ||
                  `https://ui-avatars.com/api/?name=${c.username || "User"}`
                }
                alt="comment-user"
                className="w-8 h-8 rounded-full object-cover"
              />

              <div className="bg-white px-3 py-2 rounded-lg shadow-sm w-full">

                <p className="text-xs font-semibold">
                  {c.username || "User"}
                </p>

                <p className="text-sm">
                  {c.text}
                </p>

              </div>
            </div>

          ))}

          {/* INPUT */}
          <div className="flex gap-2">

            <input
              value={text}
              onChange={(e) =>
                setText(e.target.value)
              }
              onKeyDown={handleKeyDown}
              className="flex-1 border rounded-full px-4 py-2 text-sm"
              placeholder="Write a comment..."
            />

            <button
              onClick={handleComment}
              className="bg-indigo-500 text-white px-4 py-1.5 rounded-full text-sm"
            >
              Post
            </button>

          </div>
        </div>

      )}
    </div>
  );
}