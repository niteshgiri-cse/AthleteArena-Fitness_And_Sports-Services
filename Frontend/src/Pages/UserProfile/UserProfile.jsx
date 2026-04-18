import React, { useState, useRef, useEffect } from "react";
import { Camera, Pencil } from "lucide-react";
import PostCreateModal from "./PostCreateModal";
import PostSection from "./PostSection";
import EditProfileModal from "./EditProfileModal";

import { useDispatch, useSelector } from "react-redux";
import { getProfileAction } from "@/redux/features/user/userAction";

export default function UserProfile() {
  const dispatch = useDispatch();

  const { userProfile, loading, error } = useSelector(
    (state) => state.user || {}
  );

  const [showEditModal, setShowEditModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  const [user, setUser] = useState({
    name: "Unknown",
    email: "",
    bio: "Footballer | Fitness Enthusiast | State Player",
    avatar: "https://i.pravatar.cc/150?img=12",
    cover:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200",
    followers: 0,
    following: 0,
    isFollowing: false,
    tags: ["Football", "Fitness", "State Player"],
  });

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [files, setFiles] = useState([]);
  const [posts, setPosts] = useState([]);
  const [progress, setProgress] = useState(0);

  const postContainerRef = useRef();

  useEffect(() => {
    dispatch(getProfileAction());
  }, [dispatch]);

  useEffect(() => {
    if (userProfile) {
      setUser((prev) => ({
        ...prev,
        name: userProfile.name || prev.name,
        email: userProfile.email || prev.email,
        bio: userProfile.bio || prev.bio,
        avatar: userProfile.profileImageUrl || prev.avatar,
        cover: userProfile.backgroundImageUrl || prev.cover,
        followers: userProfile.followersCount ?? prev.followers,
        following: userProfile.followingCount ?? prev.following,
        tags: userProfile.tags || prev.tags,
      }));
    }
  }, [userProfile]);

  const toggleFollow = () => {
    setUser((prev) => ({
      ...prev,
      isFollowing: !prev.isFollowing,
      followers: prev.isFollowing
        ? prev.followers - 1
        : prev.followers + 1,
    }));
  };

  const updateImage = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setUser((prev) => ({
      ...prev,
      [field]: URL.createObjectURL(file),
    }));
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
        tags: tagsInput
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        type,
        files: files.map((f) => URL.createObjectURL(f)),
      };

      setPosts((prev) => [newPost, ...prev]);

      setTitle("");
      setText("");
      setTagsInput("");
      setFiles([]);
      setShowPostModal(false);
    });
  };

  const filteredPosts = posts.filter((post) => {
    if (activeTab === "images") return post.type === "image";
    if (activeTab === "videos") return post.type === "video";
    return true;
  });

  return (
    <div className="h-screen bg-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto bg-white h-full flex flex-col shadow rounded-xl overflow-hidden relative">

        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center z-50">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-sm font-semibold text-gray-600">
              Loading Profile...
            </p>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center py-2 text-sm">
            {error}
          </div>
        )}

        <div className="relative h-52">
          <img src={user.cover} className="w-full h-full object-cover" />
          <label className="absolute top-3 right-3 bg-black/60 p-2 rounded-full cursor-pointer">
            <Camera className="text-white" size={18} />
            <input
              hidden
              type="file"
              onChange={(e) => updateImage(e, "cover")}
            />
          </label>
        </div>

        <div className="p-5 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="flex items-end gap-4">
            <div className="relative">
              <img
                src={user.avatar}
                className="w-24 h-24 rounded-full border-4 border-white -mt-16"
              />
              <label className="absolute bottom-1 right-1 bg-blue-600 p-1.5 rounded-full cursor-pointer">
                <Camera size={14} className="text-white" />
                <input
                  hidden
                  type="file"
                  onChange={(e) => updateImage(e, "avatar")}
                />
              </label>
            </div>

            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-sm font-semibold">{user.email}</p>

              <p className="text-gray-500 flex gap-2 items-center">
                {user.bio}
                <Pencil
                  size={14}
                  className="cursor-pointer hover:text-blue-600"
                  onClick={() => setShowEditModal(true)}
                />
              </p>

              <div className="flex gap-6 mt-2 text-sm font-medium">
                <span><b>{user.followers}</b> Followers</span>
                <span><b>{user.following}</b> Following</span>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {user.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-full font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={toggleFollow}
            className={`px-6 py-2 rounded-full text-sm font-semibold
            ${user.isFollowing ? "bg-gray-200" : "bg-blue-600 text-white"}`}
          >
            {user.isFollowing ? "Following" : "Follow"}
          </button>
        </div>

        <PostSection
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          postContainerRef={postContainerRef}
          filteredPosts={filteredPosts}
          setShowPostModal={setShowPostModal}
        />
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

      {showEditModal && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
}