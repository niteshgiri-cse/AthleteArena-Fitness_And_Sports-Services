import { Radio } from "lucide-react";
import PostCard from "./PostCard";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import UploadModal from "../Community/UploadModal";


export default function PostSection({
  activeTab,
  setActiveTab,
  postContainerRef,
  filteredPosts,
  setPosts, // ✅ IMPORTANT
}) {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);

  const handleGoLive = () => {
    const roomId = Math.random().toString(36).substring(2, 8);
    navigate(`/live/${roomId}`);
  };

  return (
    <>
      {/* HEADER */}
      <div className="border-y bg-white flex justify-between items-center px-6">
        <div className="flex gap-3 py-2">

          {[
            { key: "posts", label: "Posts" },
            { key: "images", label: "Images" },
            { key: "videos", label: "Videos" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                postContainerRef.current?.scrollTo({ top: 0 });
              }}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition
              ${
                activeTab === tab.key
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}

          {/* GO LIVE */}
          <button
            onClick={handleGoLive}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <Radio size={16} />
            Go Live
          </button>
        </div>

        {/* CREATE POST */}
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-5 py-2 rounded-full font-semibold shadow hover:bg-blue-700 transition"
        >
          Create Post
        </button>
      </div>

      {/* POSTS */}
      <div
        ref={postContainerRef}
        className="flex-1 overflow-y-auto bg-gray-50 p-6 min-h-0"
      >
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>

      {/* ✅ UPLOAD MODAL (CONNECTED) */}
      {showModal && (
        <UploadModal
          type={activeTab === "videos" ? "video" : "image"}
          setPosts={setPosts} // 🔥 UPDATE LIST
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}