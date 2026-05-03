import { useState } from "react";
import { useDispatch } from "react-redux";
import { deletePostAction } from "@/redux/features/user/userActions";
import { Trash2, Edit } from "lucide-react";
import PostEditModal from "./PostEditModal";

export default function PostCard({ post }) {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const handleDelete = () => {
    if (window.confirm("Delete this post?")) {
      dispatch(deletePostAction(post.id));
    }
  };

  if (!post) return null;

  const shortText =
    post.description?.length > 100
      ? post.description.slice(0, 100) + "..."
      : post.description;

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border">

      {/* 🔥 MEDIA FIXED */}
      <div className="relative h-56 w-full bg-black overflow-hidden rounded-t-2xl">

        {/* IMAGE */}
        {post.url && post.mediaType === "IMAGE" && (
          <img
            src={post.url}
            className="w-full h-full object-cover"
          />
        )}

        {/* VIDEO */}
        {post.url && post.mediaType === "VIDEO" && (
          <video
            src={post.url}
            className="w-full h-full object-cover"
            controls
            playsInline
            preload="metadata"
          />
        )}

        {/* OVERLAY (keep for style) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />
      </div>

      {/* 🔥 CONTENT */}
      <div className="p-5">

        {/* ✅ TITLE MOVED HERE */}
        <h3 className="text-base font-semibold mb-1">
          {post.title || "Untitled"}
        </h3>

        {/* DESCRIPTION */}
        <p className="text-sm text-gray-700">
          {expanded ? post.description : shortText}
        </p>

        {post.description?.length > 100 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-blue-600 text-xs mt-1"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}

        {/* TAGS */}
        <div className="flex flex-wrap gap-2 mt-3">
          {post.tags?.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="flex justify-between mt-4 border-t pt-3">
          <button onClick={() => setShowEdit(true)}>
            <Edit size={16} /> Edit
          </button>

          <button onClick={handleDelete} className="text-red-500">
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>

      {/* MODAL */}
      {showEdit && (
        <PostEditModal
          post={post}
          onClose={() => setShowEdit(false)}
        />
      )}
    </div>
  );
}