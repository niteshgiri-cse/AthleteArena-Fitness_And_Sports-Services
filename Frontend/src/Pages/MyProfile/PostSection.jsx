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
  setPosts,
}) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleGoLive = () => {
    const roomId = Math.random().toString(36).substring(2, 8);
    navigate(`/live/${roomId}`);
  };

  return (
    <>
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
              className={`px-5 py-2 rounded-full text-sm font-semibold
              ${
                activeTab === tab.key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {tab.label}
            </button>
          ))}

          <button
            onClick={handleGoLive}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600"
          >
            <Radio size={16} /> Go Live
          </button>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-5 py-2 rounded-full"
        >
          Create Post
        </button>
      </div>

      <div
        ref={postContainerRef}
        className="flex-1 overflow-y-auto bg-gray-50 p-6"
      >
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>

      {showModal && (
        <UploadModal
          type={activeTab === "videos" ? "video" : "image"}
          setPosts={setPosts}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}