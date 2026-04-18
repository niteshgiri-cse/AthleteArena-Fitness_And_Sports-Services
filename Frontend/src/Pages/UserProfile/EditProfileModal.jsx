import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useDispatch } from "react-redux";
import { updateProfileAction } from "@/redux/features/user/userAction";

export default function EditProfileModal({ user, onClose }) {

  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: "",
    bio: "",
    tags: "",
    profileImageUrl: "",
    backgroundImageUrl: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? "",
        bio: user.bio ?? "",
        tags: Array.isArray(user.tags) ? user.tags.join(", ") : "",
        profileImageUrl: user.avatar ?? "",
        backgroundImageUrl: user.cover ?? "",
      });
    }
  }, [user]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const payload = {
      ...form,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
    };

    dispatch(updateProfileAction(payload));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="bg-white w-full max-w-lg rounded-2xl p-6 relative shadow-2xl animate-[scaleIn_0.25s_ease]">

        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-gray-800">
            Edit Profile
          </h2>
          <X
            className="cursor-pointer text-gray-500 hover:text-red-500 transition"
            onClick={onClose}
          />
        </div>

        <div className="flex flex-col gap-4">

          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1 block">
              Full Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1 block">
              Bio
            </label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={3}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1 block">
              Tags
            </label>
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1 block">
              Profile Image URL
            </label>
            <input
              name="profileImageUrl"
              value={form.profileImageUrl}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1 block">
              Cover Image URL
            </label>
            <input
              name="backgroundImageUrl"
              value={form.backgroundImageUrl}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-gray-200 text-gray-700"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-full bg-blue-600 text-white"
          >
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}