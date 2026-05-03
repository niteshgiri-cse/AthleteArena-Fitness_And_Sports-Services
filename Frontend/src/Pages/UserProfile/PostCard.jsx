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
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">

      {/* 🔥 MEDIA */}
      <div className="relative h-56 w-full bg-black group">

        {post.url && post.mediaType === "IMAGE" && (
          <img
            src={post.url}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}

        {post.url && post.mediaType === "VIDEO" && (
          <video
            src={post.url}
            className="w-full h-full object-cover"
            controls
          />
        )}

        {/* 🔥 OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* 🔥 TITLE */}
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="text-white text-base font-semibold leading-snug line-clamp-2 drop-shadow">
            {post.title || "Untitled"}
          </h3>
        </div>
      </div>

      {/* 🔥 CONTENT */}
      <div className="p-5">

        {/* DESCRIPTION */}
        <p className="text-sm text-gray-700 leading-relaxed">
          {expanded ? post.description : shortText}
        </p>

        {/* READ MORE */}
        {post.description?.length > 100 && (
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

        {/* ACTION BAR */}
        <div className="flex justify-between items-center mt-4 border-t pt-3">

          {/* EDIT */}
          <button
            onClick={() => setShowEdit(true)}
            className="flex items-center gap-1 text-gray-600 text-sm hover:text-blue-600 transition"
          >
            <Edit size={16} />
            Edit
          </button>

          {/* DELETE */}
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 text-red-500 text-sm hover:text-red-600 transition"
          >
            <Trash2 size={16} />
            Delete
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