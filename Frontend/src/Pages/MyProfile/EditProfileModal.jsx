import { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import { useDispatch } from "react-redux";
import { updateProfileAction } from "@/redux/features/user/userActions";

export default function EditProfileModal({ user, onClose }) {

  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: "",
    bio: "",
    tags: "",
  });

  const [profileFile, setProfileFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  const [previewProfile, setPreviewProfile] = useState(null);
  const [previewCover, setPreviewCover] = useState(null);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? "",
        bio: user.bio ?? "",
        tags: Array.isArray(user.tags) ? user.tags.join(", ") : "",
      });

      setPreviewProfile(user.profileImageUrl || null);
      setPreviewCover(user.backgroundImageUrl || null);
    }
  }, [user]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 FILE HANDLERS
  const handleProfileImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileFile(file);
      setPreviewProfile(URL.createObjectURL(file));
    }
  };

  const handleCoverImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      setPreviewCover(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {

    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("bio", form.bio);

    // tags → multiple values
    form.tags
      .split(",")
      .map(t => t.trim())
      .filter(Boolean)
      .forEach(tag => formData.append("tags", tag));

    if (profileFile) {
      formData.append("profileImageUrl", profileFile);
    }

    if (coverFile) {
      formData.append("backgroundImageUrl", coverFile);
    }

    dispatch(updateProfileAction(formData));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold">Edit Profile</h2>
          <X onClick={onClose} className="cursor-pointer" />
        </div>

        <div className="space-y-4">

          {/* NAME */}
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full border p-3 rounded-lg"
          />

          {/* BIO */}
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Bio"
            className="w-full border p-3 rounded-lg"
          />

          {/* TAGS */}
          <input
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="Tags (comma separated)"
            className="w-full border p-3 rounded-lg"
          />

          {/* PROFILE IMAGE */}
          <div>
            <label className="text-sm font-medium">Profile Image</label>
            <div className="flex items-center gap-3 mt-2">
              {previewProfile && (
                <img
                  src={previewProfile}
                  className="h-12 w-12 rounded-full object-cover"
                />
              )}
              <label className="cursor-pointer text-blue-600 flex items-center gap-1">
                <Upload size={16} />
                Upload
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleProfileImage}
                />
              </label>
            </div>
          </div>

          {/* COVER IMAGE */}
          <div>
            <label className="text-sm font-medium">Cover Image</label>
            <div className="flex items-center gap-3 mt-2">
              {previewCover && (
                <img
                  src={previewCover}
                  className="h-12 w-20 object-cover rounded"
                />
              )}
              <label className="cursor-pointer text-blue-600 flex items-center gap-1">
                <Upload size={16} />
                Upload
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleCoverImage}
                />
              </label>
            </div>
          </div>

        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
}