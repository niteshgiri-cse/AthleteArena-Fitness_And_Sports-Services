import React, { useState, useRef, useEffect } from "react";
import { Pencil, User } from "lucide-react";
import PostCreateModal from "./PostCreateModal";
import PostSection from "./PostSection";
import EditProfileModal from "./EditProfileModal";

import { useDispatch, useSelector } from "react-redux";
import {
  getProfileAction,
  getMyPostAction,
} from "@/redux/features/user/userActions";

export default function UserProfile() {
  const dispatch = useDispatch();

  const { userProfile, userPost, loading, error } = useSelector(
    (state) => state.user || {}
  );

  const [showEditModal, setShowEditModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  const [user, setUser] = useState({
    name: "Unknown",
    email: "",
    bio: "Athlete | Fitness Enthusiast",
    avatar: null,
    cover:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200",
    followers: 0,
    following: 0,
    isFollowing: false,
    tags: [],
  });

  const postContainerRef = useRef();

  // ✅ GET CURRENT USER ID FROM TOKEN
  const getCurrentUserId = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const decoded = JSON.parse(atob(token.split(".")[1]));
      return decoded.userId;
    } catch {
      return null;
    }
  };

  const currentUserId = getCurrentUserId();
  const isOwnProfile = currentUserId === userProfile?.userId;

  // ✅ LOAD DATA
  useEffect(() => {
    dispatch(getProfileAction());
    dispatch(getMyPostAction());
  }, [dispatch]);

  // ✅ SET USER DATA
  useEffect(() => {
    if (userProfile) {
      setUser((prev) => ({
        ...prev,
        name: userProfile.name || prev.name,
        email: userProfile.email || prev.email,
        bio: userProfile.bio || prev.bio,
        avatar: userProfile.profileImageUrl || null,
        cover: userProfile.backgroundImageUrl || prev.cover,
        followers: userProfile.followersCount ?? prev.followers,
        following: userProfile.followingCount ?? prev.following,
        tags: userProfile.tags || [],
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

  // ✅ FILTER POSTS
  const filteredPosts = (userPost || []).filter((post) => {
    if (activeTab === "images") return post.mediaType === "IMAGE";
    if (activeTab === "videos") return post.mediaType === "VIDEO";
    return true;
  });

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
          <img
            src={user.cover}
            className="w-full h-full object-cover"
            alt="cover"
          />
        </div>

        {/* PROFILE */}
        <div className="p-5 flex justify-between items-end">
          <div className="flex gap-4">

            {/* AVATAR */}
            <div className="relative">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  className="w-24 h-24 rounded-full border-4 border-white -mt-16 object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full border-4 border-white -mt-16 
                bg-gray-200 flex items-center justify-center">
                  <User className="w-10 h-10 text-gray-500" />
                </div>
              )}
            </div>

            {/* INFO */}
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                {user.name}

                {/* EDIT BUTTON ONLY FOR OWN PROFILE */}
                {isOwnProfile && (
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>
                )}
              </h2>

              <p className="text-sm font-semibold">{user.email}</p>

              <p className="text-gray-500 mt-1">{user.bio}</p>

              <div className="flex gap-6 mt-2 text-sm font-medium">
                <span><b>{user.followers}</b> Followers</span>
                <span><b>{user.following}</b> Following</span>
              </div>
            </div>
          </div>

          {/* 🔥 FOLLOW BUTTON FIX */}
          {!isOwnProfile && (
            <button
              onClick={toggleFollow}
              className={`px-6 py-2 rounded-full text-sm font-semibold
              ${user.isFollowing ? "bg-gray-200" : "bg-blue-600 text-white"}`}
            >
              {user.isFollowing ? "Following" : "Follow"}
            </button>
          )}
        </div>

        {/* POSTS */}
        <PostSection
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          postContainerRef={postContainerRef}
          filteredPosts={filteredPosts}
          setShowPostModal={setShowPostModal}
        />
      </div>

      {/* MODALS */}
      {showPostModal && (
        <PostCreateModal onClose={() => setShowPostModal(false)} />
      )}

      {showEditModal && isOwnProfile && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
}