export default function PostCard({ post }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="font-semibold text-sm mb-1">{post.title}</h3>
      <p className="text-xs text-gray-500 mb-2">{post.text}</p>

      <div className="flex flex-wrap gap-1 mb-2">
        {post.tags?.map(tag => (
          <span key={tag} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
            #{tag}
          </span>
        ))}
      </div>

      {post.type === "image" &&
        post.files.map((f, i) => (
          <img key={i} src={f} className="w-full h-40 object-cover rounded mb-2" />
        ))}

      {post.type === "video" &&
        post.files.map((f, i) => (
          <video key={i} src={f} controls className="w-full h-40 object-cover rounded mb-2" />
        ))}
    </div>
  );
}