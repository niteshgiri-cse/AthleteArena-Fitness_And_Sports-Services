import React, { useState, useRef, useEffect } from "react";
import { Camera, Pencil } from "lucide-react";
import PostCreateModal from "./PostCreateModal";
import PostSection from "./PostSection";
import EditProfileModal from "./EditProfileModal";

import { useDispatch, useSelector } from "react-redux";

// ✅ FIXED IMPORT
import {
  getProfileAction,
  getMyPostAction,
} from "@/redux/features/user/userActions";

export default function UserProfile() {
  const dispatch = useDispatch();

  // ✅ GET REDUX DATA
  const { userProfile, userPost, loading, error } = useSelector(
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

  const postContainerRef = useRef();

  // ✅ LOAD PROFILE + POSTS
  useEffect(() => {
    dispatch(getProfileAction());
    dispatch(getMyPostAction()); // 🔥 IMPORTANT
  }, [dispatch]);

  // ✅ SET USER DATA
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

  // ✅ FOLLOW BUTTON
  const toggleFollow = () => {
    setUser((prev) => ({
      ...prev,
      isFollowing: !prev.isFollowing,
      followers: prev.isFollowing
        ? prev.followers - 1
        : prev.followers + 1,
    }));
  };

  // ✅ IMAGE UPDATE (LOCAL ONLY)
  const updateImage = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setUser((prev) => ({
      ...prev,
      [field]: URL.createObjectURL(file),
    }));
  };

  // ✅ FILTER POSTS (FROM BACKEND)
  const filteredPosts = (userPost || []).filter((post) => {
    if (activeTab === "images") return post.mediaType === "IMAGE";
    if (activeTab === "videos") return post.mediaType === "VIDEO";
    return true;
  });

  console.log("FINAL POSTS:", userPost); // 🔥 DEBUG

  return (
    <div className="h-screen bg-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto bg-white h-full flex flex-col shadow rounded-xl overflow-hidden relative">

        {/* LOADER */}
        {loading && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-50">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="text-red-500 text-center py-2 text-sm">
            {error}
          </div>
        )}

        {/* COVER */}
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

        {/* PROFILE */}
        <div className="p-5 flex justify-between items-end">
          <div className="flex gap-4">
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
                  className="cursor-pointer"
                  onClick={() => setShowEditModal(true)}
                />
              </p>

              <div className="flex gap-6 mt-2 text-sm font-medium">
                <span><b>{user.followers}</b> Followers</span>
                <span><b>{user.following}</b> Following</span>
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

        {/* POSTS SECTION */}
        <PostSection
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          postContainerRef={postContainerRef}
          filteredPosts={filteredPosts} // 🔥 REAL DATA
          setShowPostModal={setShowPostModal}
        />
      </div>

      {/* MODALS */}
      {showPostModal && (
        <PostCreateModal onClose={() => setShowPostModal(false)} />
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