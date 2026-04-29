import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createCourseAction } from "@/redux/features/Admin/adminActions";
import AdminCourseManager from "./AdminCourseManager";

const AdminUpload = () => {
  const dispatch = useDispatch();

  const [courseTitle, setCourseTitle] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [tags, setTags] = useState("");
  const [thumbnail, setThumbnail] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const getEmbedUrl = (id) => {
    return id ? `https://www.youtube.com/embed/${id}` : "";
  };

  const handleThumbnail = (e) => {
    const file = e.target.files[0];
    if (file) setThumbnail(file);
  };

  const handleSubmit = async () => {
    if (!thumbnail || !courseTitle || !videoTitle || !videoUrl || !videoId) {
      alert("All fields including Video ID are required");
      return;
    }

    const formData = new FormData();

    formData.append("thumbnail", thumbnail);
    formData.append("courseTitle", courseTitle);
    formData.append("videoTitle", videoTitle);
    formData.append("videoId", videoId);
    formData.append("videoLink", videoUrl);

    tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t)
      .forEach((tag) => formData.append("tags", tag));

    console.log("===== FORMDATA =====");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      setLoading(true);
      setMessage("");

      // ✅ FIX: no res.error check anymore
      const data = await dispatch(createCourseAction(formData));

      console.log("SUCCESS:", data);

      setMessage("✅ Course created successfully");

      // reset only on success
      setCourseTitle("");
      setVideoTitle("");
      setVideoUrl("");
      setVideoId("");
      setTags("");
      setThumbnail(null);

    } catch (err) {
      console.error("ERROR:", err?.response?.data || err.message);

      setMessage(
        err?.response?.data?.message || "❌ Failed to create course"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Course Info */}
        <div className="bg-white p-5 rounded-xl shadow mb-6">
          <h2 className="text-lg font-semibold mb-3">Course Info</h2>

          <input
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            placeholder="Course Title"
            className="w-full border p-3 rounded mb-3"
          />

          <label className="inline-block bg-linear-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded cursor-pointer text-sm">
            Choose Thumbnail
            <input
              type="file"
              onChange={handleThumbnail}
              className="hidden"
            />
          </label>

          {thumbnail && (
            <p className="text-xs text-gray-500 mt-2">
              {thumbnail.name}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Upload Video */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="font-semibold mb-4">Upload Video</h3>

            <input
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              placeholder="Video Title"
              className="w-full border p-2 rounded mb-2"
            />

            <input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Video Link (YouTube URL)"
              className="w-full border p-2 rounded mb-2"
            />

            <input
              value={videoId}
              onChange={(e) => setVideoId(e.target.value)}
              placeholder="Video ID (YouTube ID)"
              className="w-full border p-2 rounded mb-2"
            />

            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Tags (comma separated)"
              className="w-full border p-2 rounded mb-2"
            />
          </div>

          {/* Preview */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="font-semibold mb-4">Preview</h3>

            <div className="bg-black rounded overflow-hidden mb-4">
              {videoId ? (
                <iframe
                  className="w-full h-62.5"
                  src={getEmbedUrl(videoId)}
                  allowFullScreen
                />
              ) : (
                <div className="text-white p-5">
                  No video selected
                </div>
              )}
            </div>

            <div className="text-sm">
              <p><strong>Title:</strong> {videoTitle}</p>
              <p><strong>Tags:</strong> {tags}</p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="mt-6 text-right">

          {message && (
            <p className="mb-2 text-sm">{message}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-6 py-2 rounded text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 active:scale-95"
            }`}
          >
            {loading ? "Uploading..." : "Save Course"}
          </button>

        </div>

      </div>
       <AdminCourseManager/>
    </div>
  );
};

export default AdminUpload;