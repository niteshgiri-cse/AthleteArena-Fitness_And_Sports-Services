import { useState } from "react";
import { useDispatch } from "react-redux";
import { updatePostAction } from "@/redux/features/user/userActions";
import { X } from "lucide-react";

export default function PostEditModal({ post, onClose }) {

  const dispatch = useDispatch();

  const [title, setTitle] = useState(post.title || "");
  const [description, setDescription] = useState(post.description || "");

  const handleUpdate = () => {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);

    dispatch(updatePostAction(post.id, formData));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">

      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative">

        <X
          className="absolute right-4 top-4 cursor-pointer text-gray-500 hover:text-red-500"
          onClick={onClose}
        />

        <h2 className="text-xl font-semibold mb-5">Edit Post</h2>

        {/* 🔥 EXISTING MEDIA SHOW */}
        {post?.url && (
          <div className="mb-4">
            {post.mediaType === "IMAGE" ? (
              <img
                src={post.url}
                className="w-full h-40 object-cover rounded-lg"
              />
            ) : (
              <video
                src={post.url}
                className="w-full h-40 object-cover rounded-lg"
                controls
              />
            )}
          </div>
        )}

        {/* TITLE */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mt-1 border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* DESCRIPTION */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full mt-1 border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-5">

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            className="px-6 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition"
          >
            Update
          </button>

        </div>
      </div>
    </div>
  );
}