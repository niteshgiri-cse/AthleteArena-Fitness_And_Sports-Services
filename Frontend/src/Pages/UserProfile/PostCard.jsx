import { useState } from "react";
import { useDispatch } from "react-redux";
import { deletePostAction } from "@/redux/features/user/userActions";
import { Trash2, Edit } from "lucide-react";

export default function PostCard({ post }) {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);

  const handleDelete = () => {
    if (window.confirm("Delete this post?")) {
      dispatch(deletePostAction(post.id));
    }
  };

  if (!post) return null;

  const shortText =
    post.description?.length > 90
      ? post.description.slice(0, 90) + "..."
      : post.description;

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden border">

      {/* 🔥 MEDIA */}
      <div className="relative h-52 w-full bg-black group">

        {post.url && post.mediaType === "IMAGE" && (
          <img
            src={post.url}
            alt=""
            className="w-full h-full object-cover"
          />
        )}

        {post.url && post.mediaType === "VIDEO" && (
          <video
            src={post.url}
            className="w-full h-full object-cover"
            controls
          />
        )}

        {/* 🔥 GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* 🔥 TITLE */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white text-sm font-semibold leading-snug line-clamp-2">
            {post.title || "Untitled"}
          </h3>
        </div>
      </div>

      {/* 🔥 CONTENT */}
      <div className="p-4">

        {/* DESCRIPTION */}
        <p className="text-sm text-gray-700 leading-relaxed">
          {expanded ? post.description : shortText}
        </p>

        {/* MORE */}
        {post.description?.length > 90 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-blue-600 text-xs font-medium mt-1 hover:underline"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}

        {/* TAGS */}
        <div className="flex flex-wrap gap-2 mt-3">
          {post.tags?.map((tag) => (
            <span
              key={tag}
              className="text-[11px] bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* 🔥 ACTION BAR */}
        <div className="flex justify-between items-center mt-4 border-t pt-3">

          {/* LEFT ACTIONS (future use) */}
          <div className="flex gap-3 text-gray-500 text-sm">
            <button className="hover:text-blue-600 transition">
              <Edit size={16} />
            </button>
          </div>

          {/* RIGHT DELETE */}
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 text-red-500 text-xs font-medium hover:text-red-600 transition"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}