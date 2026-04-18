import { useEffect, useState, useCallback, useRef } from "react"; // ✅ added useRef
import { Image, Video, Send } from "lucide-react";
import PostCard from "./PostCard";
import UploadModal from "./UploadModal";
import { getFeed } from "@/api/mediaApi";

import { useSelector, useDispatch } from "react-redux";
import { getProfileAction } from "@/redux/features/user/userAction";

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [caption, setCaption] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState("");

  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef(null); // ✅ new

  const dispatch = useDispatch();
  const { userProfile } = useSelector((state) => state.user || {});

  useEffect(() => {
    dispatch(getProfileAction());
  }, [dispatch]);

  const loadPosts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const res = await getFeed(page);

      setPosts((prev) => {
        const merged = [...prev, ...res.content];
        const unique = Array.from(
          new Map(merged.map((item) => [item.id, item])).values()
        );
        return unique;
      });

      setPage((prev) => prev + 1);
      if (res.last) setHasMore(false);
    } catch (err) {
      console.error("Feed error:", err);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  // ✅ Initial load (unchanged behavior)
  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // ✅ REPLACED SCROLL WITH OBSERVER (no UI change)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadPosts();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [loadPosts, hasMore, loading]);

  const handleSend = async () => {
    if (!caption.trim()) return;

    console.log("Caption:", caption);
    setCaption("");

    await refreshFeed();
  };

  const refreshFeed = async () => {
    setPosts([]);
    setPage(0);
    setHasMore(true);

    setLoading(true);
    try {
      const res = await getFeed(0);
      setPosts(res.content);
      setPage(1);
      if (res.last) setHasMore(false);
    } catch (err) {
      console.error("Feed error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-3">
      <div className="max-w-2xl mx-auto space-y-6">

        <div className="bg-white p-4 rounded-2xl shadow-sm border space-y-4">
          <div className="flex gap-3 items-center">
            <img
              src={
                userProfile?.profileImageUrl ||
                "https://i.pravatar.cc/100"
              }
              className="h-10 w-10 rounded-full"
            />

            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Share something..."
              className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-sm"
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-4 text-gray-600 text-sm">
              <button
                onClick={() => {
                  setType("image");
                  setShowModal(true);
                }}
                className="flex gap-1 hover:text-indigo-500"
              >
                <Image size={18} /> Photo
              </button>

              <button
                onClick={() => {
                  setType("video");
                  setShowModal(true);
                }}
                className="flex gap-1 hover:text-indigo-500"
              >
                <Video size={18} /> Video
              </button>
            </div>

            <button
              onClick={handleSend}
              className="bg-indigo-500 text-white px-4 py-1.5 rounded-full flex gap-1 text-sm"
            >
              <Send size={16} /> Post
            </button>
          </div>
        </div>

        {posts.map((post) => (
          <PostCard
            key={`${post.id}-${post.createdAt}`}
            post={post}
          />
        ))}

        {/* ✅ invisible trigger (no UI change) */}
        <div ref={observerRef} className="h-10" />

        {loading && (
          <p className="text-center text-gray-500">Loading...</p>
        )}

        {!hasMore && (
          <p className="text-center text-gray-400 text-sm">
            No more posts
          </p>
        )}
      </div>

      {showModal && (
        <UploadModal
          type={type}
          setPosts={setPosts}
          onClose={() => {
            setShowModal(false);
            refreshFeed();
          }}
        />
      )}
    </div>
  );
}