import { useState } from "react";
import { Image, Video, Send } from "lucide-react";

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState("");
  const [commentInput, setCommentInput] = useState({});

  // 🔹 File Upload
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setMedia(URL.createObjectURL(file));
    setMediaType(type);
  };

  // 🔹 Create Post
  const handlePost = () => {
    if (!caption && !media) return;

    const newPost = {
      id: Date.now(),
      user: "You",
      avatar: "https://i.pravatar.cc/100",
      time: "Just now",
      caption,
      media,
      mediaType,
      likes: 0,
      liked: false,
      comments: [],
      showComments: false,
    };

    setPosts([newPost, ...posts]);
    setCaption("");
    setMedia(null);
  };

  // 🔹 Like Toggle
  const toggleLike = (id) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  // 🔹 Add Comment
  const addComment = (id) => {
    const text = commentInput[id];
    if (!text) return;

    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? {
              ...post,
              comments: [...post.comments, { text }],
            }
          : post
      )
    );

    setCommentInput({ ...commentInput, [id]: "" });
  };

  // 🔹 Toggle Comment Box
  const toggleComments = (id) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? { ...post, showComments: !post.showComments }
          : post
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        <div className="bg-white p-4 rounded-2xl shadow-sm border">
          <div className="flex gap-3">
            <img src="https://i.pravatar.cc/100" className="h-10 w-10 rounded-full" />

            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Share something..."
              className="flex-1 bg-slate-100 rounded-full px-4 outline-none"
            />
          </div>

          {media && (
            <div className="mt-3">
              {mediaType === "image" ? (
                <img src={media} className="w-full h-60 object-cover rounded-lg" />
              ) : (
                <video src={media} controls className="w-full h-60 rounded-lg" />
              )}
            </div>
          )}

          <div className="flex justify-between mt-4">
            <label className="cursor-pointer flex gap-2">
              <Image /> Photo
              <input type="file" hidden accept="image/*" onChange={(e) => handleFileChange(e, "image")} />
            </label>

            <label className="cursor-pointer flex gap-2">
              <Video /> Video
              <input type="file" hidden accept="video/*" onChange={(e) => handleFileChange(e, "video")} />
            </label>

            <button onClick={handlePost} className="bg-indigo-500 text-white px-4 py-1 rounded-full flex gap-1">
              <Send /> Post
            </button>
          </div>
        </div>

        {/* 🔥 POSTS */}
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-2xl border">

            {/* Header */}
            <div className="flex items-center gap-3 p-4">
              <img src={post.avatar} className="h-10 w-10 rounded-full" />
              <div>
                <h3>{post.user}</h3>
                <p className="text-xs text-gray-500">{post.time}</p>
              </div>
            </div>

            <p className="px-4">{post.caption}</p>

            {/* Media */}
            {post.mediaType === "image" ? (
              <img src={post.media} className="w-full h-80 object-cover" />
            ) : (
              <video src={post.media} controls className="w-full h-80" />
            )}

            {/* Actions */}
            <div className="flex justify-between px-6 py-3 text-sm">

              <button onClick={() => toggleLike(post.id)}>
                {post.liked ? "❤️" : "🤍"} {post.likes}
              </button>

              <button onClick={() => toggleComments(post.id)}>
                💬 {post.comments.length}
              </button>

              <button
                onClick={() => navigator.share?.({ text: post.caption })}
              >
                🔗 Share
              </button>
            </div>

            {/* COMMENTS */}
            {post.showComments && (
              <div className="px-4 pb-3">

                {post.comments.map((c, i) => (
                  <p key={i} className="text-sm bg-slate-100 p-2 rounded mt-1">
                    {c.text}
                  </p>
                ))}

                <div className="flex gap-2 mt-2">
                  <input
                    value={commentInput[post.id] || ""}
                    onChange={(e) =>
                      setCommentInput({
                        ...commentInput,
                        [post.id]: e.target.value,
                      })
                    }
                    placeholder="Write comment..."
                    className="flex-1 border rounded px-2"
                  />

                  <button
                    onClick={() => addComment(post.id)}
                    className="text-indigo-500"
                  >
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}