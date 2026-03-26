import { X } from "lucide-react";

export default function PostViewModal({ post, onClose }) {
  if (!post) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white max-w-2xl w-full rounded-xl p-6 relative">

        <X className="absolute right-4 top-4 cursor-pointer" onClick={onClose} />

        <h2 className="text-xl font-bold mb-2">{post.title}</h2>

        <p className="text-gray-600 mb-3">{post.text}</p>

        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags?.map(tag => (
            <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">
              #{tag}
            </span>
          ))}
        </div>

        {post.files.map((f, i) =>
          post.type === "video" ? (
            <video key={i} src={f} controls className="w-full rounded-lg mb-2" />
          ) : (
            <img key={i} src={f} className="w-full rounded-lg mb-2" />
          )
        )}

      </div>
    </div>
  );
}