import React, { useState, useRef } from "react";
import { Camera, Pencil, Radio } from "lucide-react";
import PostCreateModal from "./PostCreateModal";

export default function UserProfile() {

  const [showPostModal, setShowPostModal] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  const [user, setUser] = useState({
    name: "Rohit Sharma",
    bio: "Footballer | Fitness Enthusiast | State Player",
    avatar: "https://i.pravatar.cc/150?img=12",
    cover: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200",
    followers: 1280,
    following: 350,
    isFollowing: false,
    tags: ["Football", "Fitness", "State Player"]
  });

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [files, setFiles] = useState([]);
  const [posts, setPosts] = useState([]);
  const [progress, setProgress] = useState(0);

  const postContainerRef = useRef();

  const toggleFollow = () => {
    setUser(prev => ({
      ...prev,
      isFollowing: !prev.isFollowing,
      followers: prev.isFollowing ? prev.followers - 1 : prev.followers + 1
    }));
  };

  const updateImage = (e, field) => {
    const f = e.target.files[0];
    if (f) setUser(prev => ({ ...prev, [field]: URL.createObjectURL(f) }));
  };

  const handleFiles = (selected) => {
    if (!selected.length) return;
    setFiles(selected);
  };

  const simulateUpload = (cb) => {
    let val = 0;
    const interval = setInterval(() => {
      val += 10;
      setProgress(val);
      if (val >= 100) {
        clearInterval(interval);
        setProgress(0);
        cb();
      }
    }, 150);
  };

  const createPost = () => {
    simulateUpload(() => {

      let type = "posts";

      if (files.length > 0) {
        if (files[0].type.startsWith("video")) type = "video";
        else if (files[0].type.startsWith("image")) type = "image";
      }

      const newPost = {
        id: Date.now(),
        title,
        text,
        tags: tagsInput.split(",").map(t => t.trim()).filter(Boolean),
        type,
        files: files.map(f => URL.createObjectURL(f)),
      };

      setPosts(prev => [newPost, ...prev]);

      setTitle("");
      setText("");
      setTagsInput("");
      setFiles([]);
      setShowPostModal(false);
    });
  };

  const filteredPosts = posts.filter(post => {
    if (activeTab === "images") return post.type === "image";
    if (activeTab === "videos") return post.type === "video";
    return true;
  });

  return (
    <div className="h-screen bg-gray-100 overflow-hidden">

      <div className="max-w-7xl mx-auto bg-white h-full flex flex-col shadow rounded-xl overflow-hidden">

        <div className="relative h-52">
          <img src={user.cover} className="w-full h-full object-cover" />
          <label className="absolute top-3 right-3 bg-black/60 p-2 rounded-full cursor-pointer">
            <Camera className="text-white" size={18} />
            <input hidden type="file" onChange={(e) => updateImage(e, "cover")} />
          </label>
        </div>

        <div className="p-5 flex flex-col md:flex-row md:items-end md:justify-between gap-4">

          <div className="flex items-end gap-4">
            <div className="relative">
              <img src={user.avatar} className="w-24 h-24 rounded-full border-4 border-white -mt-16" />
              <label className="absolute bottom-1 right-1 bg-blue-600 p-1.5 rounded-full cursor-pointer">
                <Camera size={14} className="text-white" />
                <input hidden type="file" onChange={(e) => updateImage(e, "avatar")} />
              </label>
            </div>

            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-gray-500 flex gap-2 items-center">{user.bio} <Pencil size={14} /></p>

              <div className="flex gap-6 mt-2 text-sm font-medium">
                <span><b>{user.followers}</b> Followers</span>
                <span><b>{user.following}</b> Following</span>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {user.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-full font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={toggleFollow}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all
            ${user.isFollowing
              ? "bg-gray-200 text-gray-700"
              : "bg-blue-600 text-white hover:bg-blue-700 shadow"}`}
          >
            {user.isFollowing ? "Following" : "Follow"}
          </button>

        </div>

        <div className="border-y bg-white flex justify-between items-center px-6">

          <div className="flex gap-3 py-2">

            {[
              { key: "posts", label: "Posts" },
              { key: "images", label: "Images" },
              { key: "videos", label: "Videos" }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  postContainerRef.current?.scrollTo({ top: 0 });
                }}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition
                ${activeTab === tab.key
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {tab.label}
              </button>
            ))}

            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <Radio size={16} />
              Go Live
            </button>

          </div>

          <button
            onClick={() => setShowPostModal(true)}
            className="bg-blue-600 text-white px-5 py-2 rounded-full font-semibold shadow hover:bg-blue-700 transition"
          >
            Create Post
          </button>

        </div>

        <div ref={postContainerRef} className="flex-1 overflow-y-auto bg-gray-50 p-6 min-h-0">

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

            {filteredPosts.map(post => (
              <div key={post.id} className="bg-white rounded-xl shadow p-4">

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
            ))}

          </div>

        </div>

      </div>

      {showPostModal && (
        <PostCreateModal
          onClose={() => setShowPostModal(false)}
          title={title}
          setTitle={setTitle}
          text={text}
          setText={setText}
          tagsInput={tagsInput}
          setTagsInput={setTagsInput}
          handleFiles={handleFiles}
          files={files}
          progress={progress}
          createPost={createPost}
        />
      )}

    </div>
  );
}