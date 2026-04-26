import React, { useState } from "react";

const AdminUpload = () => {
  const [course, setCourse] = useState({
    title: "",
    modules: [],
  });

  const addModule = () => {
    setCourse({
      ...course,
      modules: [...course.modules, { name: "", videos: [] }],
    });
  };

  const addVideo = (index) => {
    const updated = [...course.modules];
    updated[index].videos.push({ title: "", youtubeId: "" });
    setCourse({ ...course, modules: updated });
  };

  const handleSubmit = () => {
    console.log("UPLOAD DATA:", course);

    // 👉 yaha API call karna hai (Spring Boot)
    // fetch('/api/course', { method:'POST', body: JSON.stringify(course) })
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Admin Upload</h2>

      <input
        placeholder="Course Title"
        className="border p-2 w-full mb-4"
        onChange={(e) => setCourse({ ...course, title: e.target.value })}
      />

      {course.modules.map((mod, i) => (
        <div key={i} className="border p-3 mb-4">

          <input
            placeholder="Module Name"
            className="border p-2 w-full mb-2"
            onChange={(e) => {
              const updated = [...course.modules];
              updated[i].name = e.target.value;
              setCourse({ ...course, modules: updated });
            }}
          />

          {mod.videos.map((vid, j) => (
            <div key={j} className="mb-2">
              <input
                placeholder="Video Title"
                className="border p-1 mr-2"
                onChange={(e) => {
                  const updated = [...course.modules];
                  updated[i].videos[j].title = e.target.value;
                  setCourse({ ...course, modules: updated });
                }}
              />

              <input
                placeholder="YouTube ID"
                className="border p-1"
                onChange={(e) => {
                  const updated = [...course.modules];
                  updated[i].videos[j].youtubeId = e.target.value;
                  setCourse({ ...course, modules: updated });
                }}
              />
            </div>
          ))}

          <button
            onClick={() => addVideo(i)}
            className="text-blue-600"
          >
            + Add Video
          </button>
        </div>
      ))}

      <button onClick={addModule} className="mr-4 text-green-600">
        + Add Module
      </button>

      <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2">
        Save Course
      </button>
    </div>
  );
};

export default AdminUpload;