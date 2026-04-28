import React, { useState } from "react";

const AdminUpload = () => {
  const [course, setCourse] = useState({
    title: "",
    videos: [
      { title: "", videoUrl: "", tags: "" }
    ],
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  // ADD
  const addVideo = () => {
    setCourse((prev) => ({
      ...prev,
      videos: [...prev.videos, { title: "", videoUrl: "", tags: "" }],
    }));
  };

  // DELETE
  const deleteVideo = (index) => {
    const updated = course.videos.filter((_, i) => i !== index);
    setCourse({ ...course, videos: updated });
    if (currentIndex === index) setCurrentIndex(0);
  };

  // UPDATE
  const updateVideo = (index, field, value) => {
    const videos = [...course.videos];
    videos[index][field] = value;
    setCourse({ ...course, videos });
  };

  // Convert YouTube URL → Embed
  const getEmbedUrl = (url) => {
    try {
      const videoId = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } catch {
      return "";
    }
  };

  const currentVideo = course.videos[currentIndex];

  const handleSubmit = () => {
    console.log("FINAL DATA:", course);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* COURSE TITLE */}
        <div className="bg-white p-5 rounded-xl shadow mb-6">
          <h2 className="text-lg font-semibold mb-3">Course Info</h2>
          <input
            value={course.title}
            onChange={(e) =>
              setCourse({ ...course, title: e.target.value })
            }
            placeholder="Course Title"
            className="w-full border p-3 rounded"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* LEFT → FORM */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="font-semibold mb-4">Upload Videos</h3>

            {course.videos.map((vid, i) => (
              <div key={i} className="border p-3 rounded mb-3">

                <input
                  value={vid.title}
                  onChange={(e) =>
                    updateVideo(i, "title", e.target.value)
                  }
                  placeholder="Video Title"
                  className="w-full border p-2 rounded mb-2"
                />

                <input
                  value={vid.videoUrl}
                  onChange={(e) =>
                    updateVideo(i, "videoUrl", e.target.value)
                  }
                  placeholder="Video Link (YouTube URL)"
                  className="w-full border p-2 rounded mb-2"
                />

                <input
                  value={vid.tags}
                  onChange={(e) =>
                    updateVideo(i, "tags", e.target.value)
                  }
                  placeholder="Tags (comma separated)"
                  className="w-full border p-2 rounded mb-2"
                />

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setCurrentIndex(i)}
                    className="text-blue-600 text-sm"
                  >
                    ▶ Preview
                  </button>

                  <button
                    onClick={() => deleteVideo(i)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={addVideo}
              className="mt-3 px-4 py-2 border rounded text-sm"
            >
              + Add Video
            </button>
          </div>

          {/* RIGHT → PREVIEW */}
          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="font-semibold mb-4">Preview</h3>

            <div className="bg-black rounded overflow-hidden mb-4">
              {currentVideo?.videoUrl ? (
                <iframe
                  className="w-full h-[250px]"
                  src={getEmbedUrl(currentVideo.videoUrl)}
                  allowFullScreen
                />
              ) : (
                <div className="text-white p-5">
                  No video selected
                </div>
              )}
            </div>

            <div className="text-sm">
              <p><strong>Title:</strong> {currentVideo?.title}</p>
              <p><strong>Tags:</strong> {currentVideo?.tags}</p>
            </div>
          </div>
        </div>

        {/* SAVE */}
        <div className="mt-6 text-right">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            Save Course
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminUpload;