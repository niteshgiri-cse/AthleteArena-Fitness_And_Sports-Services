import { useState } from "react";
import { Pencil } from "lucide-react";

export default function PostCard({ post, onEdit }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex justify-between mb-2">
        <p className="text-sm">{post.text}</p>
        <Pencil
          size={16}
          className="cursor-pointer"
          onClick={() => onEdit(post)}
        />
      </div>

      {post.files?.map((f, i) =>
        post.type === "image" ? (
          <img
            key={i}
            src={f}
            className="w-full h-48 object-cover rounded-lg mb-2"
          />
        ) : (
          <video
            key={i}
            controls
            src={f}
            className="w-full h-48 object-cover rounded-lg mb-2 bg-black"
          />
        )
      )}
    </div>
  );
}