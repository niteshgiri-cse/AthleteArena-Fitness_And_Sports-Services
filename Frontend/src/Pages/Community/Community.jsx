import { useEffect, useState, useRef, useCallback } from "react";
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

  // prevents duplicate api calls
  const fetchingRef = useRef(false);

  const dispatch = useDispatch();

  const { userProfile } = useSelector(
    (state) => state.user || {}
  );

  // ================= PROFILE =================

  useEffect(() => {

    dispatch(getProfileAction());

  }, [dispatch]);

  // ================= LOAD POSTS =================

  const loadPosts = useCallback(async () => {

    // stop duplicate api calls
    if (fetchingRef.current) return;

    // stop if no more data
    if (!hasMore) return;

    fetchingRef.current = true;

    setLoading(true);

    try {

      console.log("FETCHING PAGE:", page);

      const response = await getFeed(page);

      console.log("API RESPONSE:", response);

      // ✅ FIXED
      // getFeed already returns res.data
      const data = response;

      // safe content extraction
      const newPosts = Array.isArray(data?.content)
        ? data.content
        : [];

      console.log("NEW POSTS:", newPosts);

      // remove invalid items
      const validPosts = newPosts.filter(
        (item) =>
          item &&
          item.id &&
          item.mediaType &&
          item.url
      );

      console.log("VALID POSTS:", validPosts);

      // merge unique posts
      setPosts((prev) => {

        // previous safe
        const safePrev = Array.isArray(prev)
          ? prev.filter(
              (item) =>
                item &&
                item.id &&
                item.mediaType &&
                item.url
            )
          : [];

        const merged = [
          ...safePrev,
          ...validPosts,
        ];

        // remove duplicate ids
        return Array.from(
          new Map(
            merged.map((item) => [
              item.id,
              item,
            ])
          ).values()
        );
      });

      // next page
      setPage((prev) => prev + 1);

      // stop loading more
      if (
        data?.last ||
        validPosts.length === 0
      ) {
        setHasMore(false);
      }

    } catch (err) {

      console.error(
        "LOAD POSTS ERROR:",
        err
      );

      // stop infinite retries
      setHasMore(false);

    } finally {

      fetchingRef.current = false;

      setLoading(false);
    }

  }, [page, hasMore]);

  // ================= INITIAL LOAD =================

  useEffect(() => {

    loadPosts();

  }, []);

  // ================= INFINITE SCROLL =================

  useEffect(() => {

    const currentRef = observerRef.current;

    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {

        const first = entries[0];

        if (
          first.isIntersecting &&
          hasMore &&
          !fetchingRef.current
        ) {
          loadPosts();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "200px",
      }
    );

    observer.observe(currentRef);

    return () => {
      observer.disconnect();
    };

  }, [loadPosts, hasMore]);

  // ================= SAFE POSTS =================

  const safePosts = Array.isArray(posts)
    ? posts.filter(
        (post) =>
          post &&
          post.id &&
          post.mediaType &&
          post.url
      )
    : [];

  console.log("SAFE POSTS:", safePosts);

  // ================= UI =================

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
              alt="profile"
              className="w-10 h-10 rounded-full object-cover"
            />

            <input
              value={caption}
              onChange={(e) =>
                setCaption(e.target.value)
              }
              placeholder="Share something..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none"
            />
          </div>

          <div className="flex justify-between items-center mt-4">

            <div className="flex gap-6 text-gray-600">

              {/* IMAGE */}
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

              {/* VIDEO */}
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

            {/* POST */}
            <button
              onClick={() => {

                if (!caption.trim()) {

                  alert(
                    "Write something first"
                  );

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
        {safePosts.length > 0 ? (

          safePosts.map((post, index) => (

            <PostCard
              key={post.id || index}
              post={post}
            />

          ))

        ) : (

          !loading && (

            <div className="bg-white rounded-xl p-8 text-center border shadow-sm">

              <p className="text-gray-500">
                No posts available
              </p>

            </div>

          )

        )}

        {/* OBSERVER */}
        <div
          ref={observerRef}
          className="h-10"
        />

        {/* LOADING */}
        {loading && (

          <p className="text-center text-gray-500">
            Loading...
          </p>

        )}

        {/* END */}
        {!hasMore &&
          safePosts.length > 0 && (

          <p className="text-center text-gray-500">
            No more posts
          </p>

        )}

      </div>

      {/* MODAL */}
      {showModal && (

        <UploadModal
          type={type}
          caption={caption}
          setPosts={setPosts}
          onClose={() =>
            setShowModal(false)
          }
        />

      )}
    </div>
  );
}