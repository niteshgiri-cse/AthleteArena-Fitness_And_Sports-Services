import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllVideosAction,
} from "@/redux/features/course/courseAction";

import {
  deleteCourseAction,
  updateCourseAction,
} from "@/redux/features/Admin/adminActions";

const AdminCourseManager = () => {
  const dispatch = useDispatch();
  const { courses, loading } = useSelector((state) => state.course);

  const [editData, setEditData] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    dispatch(getAllVideosAction());
  }, [dispatch]);

  // ================= DELETE =================
  const handleDelete = async (videoId) => {
    if (!window.confirm("Delete this video?")) return;

    try {
      await dispatch(deleteCourseAction(videoId));
      alert("✅ Deleted successfully");
      dispatch(getAllVideosAction());
    } catch (err) {
      alert("❌ Delete failed");
    }
  };

  // ================= EDIT =================
  const handleEdit = (course) => {
    setEditData({
      ...course,
      tags: course.tags?.join(",") || "",
      newThumbnail: null,
    });
  };

  // ================= UPDATE =================
  const handleUpdate = async () => {
    try {
      setUpdating(true);

      const formData = new FormData();

      formData.append("courseTitle", editData.courseTitle);
      formData.append("videoTitle", editData.videoTitle);
      formData.append("videoLink", editData.videoLink);

      editData.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t)
        .forEach((tag) => formData.append("tags", tag));

      if (editData.newThumbnail) {
        formData.append("thumbnail", editData.newThumbnail);
      }

      await dispatch(
        updateCourseAction(editData.videoId, formData)
      );

      alert("✅ Updated successfully");

      setEditData(null);
      dispatch(getAllVideosAction());

    } catch (err) {
      console.error(err);
      alert("❌ Update failed");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Manage Courses</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.videoId}
              className="bg-white rounded-xl shadow p-4"
            >
              <img
                src={course.thumbnail}
                className="h-40 w-full object-cover rounded"
              />

              <h3 className="font-bold mt-3">
                {course.courseTitle}
              </h3>

              <p className="text-sm text-gray-500">
                {course.videoTitle}
              </p>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleEdit(course)}
                  className="bg-yellow-400 px-3 py-1 rounded text-sm"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(course.videoId)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= EDIT MODAL ================= */}
      {editData && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96">

            <h3 className="font-bold mb-3">Edit Course</h3>

            <input
              value={editData.courseTitle}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  courseTitle: e.target.value,
                })
              }
              className="w-full border p-2 mb-2"
            />

            <input
              value={editData.videoTitle}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  videoTitle: e.target.value,
                })
              }
              className="w-full border p-2 mb-2"
            />

            <input
              value={editData.videoLink}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  videoLink: e.target.value,
                })
              }
              className="w-full border p-2 mb-2"
            />

            <input
              value={editData.tags}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  tags: e.target.value,
                })
              }
              className="w-full border p-2 mb-2"
            />

            <input
              type="file"
              onChange={(e) =>
                setEditData({
                  ...editData,
                  newThumbnail: e.target.files[0],
                })
              }
              className="mb-3"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditData(null)}
                className="px-3 py-1 border"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                disabled={updating}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                {updating ? "Saving..." : "Save"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourseManager;