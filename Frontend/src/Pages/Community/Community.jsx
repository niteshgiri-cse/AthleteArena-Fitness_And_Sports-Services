import { Image, Video, Send } from "lucide-react";

const posts = [
  {
    id: 1,
    user: "Aman Fitness",
    avatar: "https://i.pravatar.cc/100?img=3",
    time: "2 hrs ago",
    caption: "Morning strength training 💪",
    media:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
  },
  {
    id: 2,
    user: "Riya Runner",
    avatar: "https://i.pravatar.cc/100?img=5",
    time: "5 hrs ago",
    caption: "Speed session done 🏃‍♀️🔥",
    media:
      "https://images.unsplash.com/photo-1546484959-f2c1f3c2e4c3",
  },
];

export default function Community() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">

      <div className="max-w-2xl mx-auto space-y-6">

        <div className="bg-white p-4 rounded-2xl shadow-sm border">
          <div className="flex gap-3">
            <img
              src="https://i.pravatar.cc/100"
              className="h-10 w-10 rounded-full"
            />

            <input
              placeholder="Share your training, progress or event..."
              className="flex-1 bg-slate-100 rounded-full px-4 outline-none"
            />
          </div>

          <div className="flex justify-between mt-4">
            <button className="flex items-center gap-2 text-slate-600 hover:text-indigo-600">
              <Image className="h-5 w-5" /> Photo
            </button>

            <button className="flex items-center gap-2 text-slate-600 hover:text-indigo-600">
              <Video className="h-5 w-5" /> Video
            </button>

            <button className="bg-linear-to-r from-indigo-500 to-violet-500 text-white px-4 py-1 rounded-full flex items-center gap-1">
              <Send className="h-4 w-4" /> Post
            </button>
          </div>
        </div>

        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-2xl shadow-sm border overflow-hidden"
          >
            <div className="flex items-center gap-3 p-4">
              <img
                src={post.avatar}
                className="h-10 w-10 rounded-full"
              />
              <div>
                <h3 className="font-semibold text-slate-800">
                  {post.user}
                </h3>
                <p className="text-xs text-slate-500">{post.time}</p>
              </div>
            </div>

            <p className="px-4 pb-3 text-slate-700">{post.caption}</p>

            <img src={post.media} className="w-full h-80 object-cover" />

            <div className="flex justify-between px-6 py-3 text-slate-600 text-sm">
              <button className="hover:text-indigo-600">❤️ Like</button>
              <button className="hover:text-indigo-600">💬 Comment</button>
              <button className="hover:text-indigo-600">🔗 Share</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}