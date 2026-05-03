import { useEffect, useState, useRef } from "react";
import { Image, Video, Send } from "lucide-react";
import PostCard from "./PostCard";
import UploadModal from "./UploadModal";
import { getFeed } from "@/api/mediaApi";
import { useSelector, useDispatch } from "react-redux";
import { getProfileAction } from "@/redux/features/user/userActions";

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [caption, setCaption] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState("image");

  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef(null);

  const dispatch = useDispatch();
  const { userProfile } = useSelector((state) => state.user || {});

  useEffect(() => {
    dispatch(getProfileAction());
  }, [dispatch]);

  const loadPosts = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const res = await getFeed(page);
      const newPosts = res.data.content || [];

      setPosts((prev) => {
        const merged = [...prev, ...newPosts];
        return Array.from(
          new Map(merged.map((item) => [item.id, item])).values()
        );
      });

      setPage((prev) => prev + 1);

      if (res.data.last) setHasMore(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          loadPosts();
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [loading, hasMore]);

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-3">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* CREATE POST */}
        <div className="bg-white p-4 rounded-xl border shadow-sm">

          <div className="flex gap-3 items-center">
            <img
              src={
                userProfile?.profileImageUrl ||
                "https://ui-avatars.com/api/?name=User"
              }
              className="w-10 h-10 rounded-full object-cover"
            />

            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Share something..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none"
            />
          </div>

          <div className="flex justify-between items-center mt-4">

            <div className="flex gap-6 text-gray-600">
              <button
                onClick={() => {
                  setType("image");
                  setShowModal(true);
                }}
                className="flex items-center gap-2 hover:text-indigo-500"
              >
                <Image size={18} />
                <span>Photo</span>
              </button>

              <button
                onClick={() => {
                  setType("video");
                  setShowModal(true);
                }}
                className="flex items-center gap-2 hover:text-indigo-500"
              >
                <Video size={18} />
                <span>Video</span>
              </button>
            </div>

            {/* ✅ FIXED POST BUTTON */}
            <button
              onClick={() => {
                if (!caption.trim()) {
                  alert("Write something first");
                  return;
                }

                setType("image");
                setShowModal(true);
              }}
              className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-full"
            >
              <Send size={16} />
              <span>Post</span>
            </button>
          </div>
        </div>

        {/* POSTS */}
        {posts.map((post, index) => (
          <PostCard key={post.id || index} post={post} />
        ))}

        <div ref={observerRef} className="h-10" />

        {loading && <p className="text-center">Loading...</p>}
        {!hasMore && <p className="text-center">No more posts</p>}
      </div>

      {/* MODAL */}
      {showModal && (
        <UploadModal
          type={type}
          caption={caption}   // ✅ PASS CAPTION
          setPosts={setPosts}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}