import { useState } from "react";
import { UploadCloud } from "lucide-react";
import { uploadImage, uploadVideo } from "@/api/mediaApi";

const CATEGORY_OPTIONS = [
  "SPORT",
  "FITNESS",
  "INDOOR",
  "OUTDOOR",
  "SPORTS",
  "OTHER",
];

export default function UploadModal({ type, setPosts, onClose }) {
  const [form, setForm] = useState({
    file: null,
    title: "",
    description: "",
    categories: [],
    tags: [],
  });

  const [tagInput, setTagInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const validateFile = (file) => {
    if (!file) return "Please choose a file first";

    const imageTypes = ["image/jpeg", "image/png", "image/webp"];
    const videoTypes = ["video/mp4", "video/webm", "video/ogg"];

    const maxImageSize = 5 * 1024 * 1024;
    const maxVideoSize = 50 * 1024 * 1024;

    if (type === "image") {
      if (!imageTypes.includes(file.type)) {
        return "Please upload a JPG, PNG or WEBP image";
      }
      if (file.size > maxImageSize) {
        return "Image should be smaller than 5MB";
      }
    }

    if (type === "video") {
      if (!videoTypes.includes(file.type)) {
        return "Please upload a MP4, WEBM or OGG video";
      }
      if (file.size > maxVideoSize) {
        return "Video should be smaller than 50MB";
      }
    }

    return null;
  };

  const addTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!form.tags.includes(tagInput.trim())) {
        setForm({
          ...form,
          tags: [...form.tags, tagInput.trim()],
        });
      }
      setTagInput("");
    }
  };

  const removeTag = (tag) => {
    setForm({
      ...form,
      tags: form.tags.filter((t) => t !== tag),
    });
  };

  const toggleCategory = (cat) => {
    if (form.categories.includes(cat)) {
      setForm({
        ...form,
        categories: form.categories.filter((c) => c !== cat),
      });
    } else {
      setForm({
        ...form,
        categories: [...form.categories, cat],
      });
    }
  };

  // ✅ ONLY FIX HERE
  const upload = async () => {
    const error = validateFile(form.file);
    if (error) {
      setErrorMsg(error);
      return;
    }

    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const payload = {
        file: form.file,
        title: form.title,
        description: form.description,
        category: form.categories,
        tags: form.tags,
      };

      let res;

      if (type === "image") {
        res = await uploadImage(payload);
      } else {
        res = await uploadVideo(payload);
      }

      // ✅ SAFE CALL (fix)
      if (typeof setPosts === "function") {
        setPosts((prev) => [res, ...prev]);
      }

      setSuccessMsg("✅ Upload successful");

      onClose();
    } catch (error) {
      setErrorMsg(error?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-2xl w-full max-w-md space-y-4">

        <h2 className="text-xl font-semibold text-center">
          Upload {type === "image" ? "Image" : "Video"}
        </h2>

        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-indigo-500 transition">
          <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />

          <p className="text-sm text-gray-500">
            Click to upload {type}
          </p>

          {form.file && (
            <p className="text-xs text-green-600 mt-2">
              {form.file.name}
            </p>
          )}

          <input
            type="file"
            accept={`${type}/*`}
            hidden
            onChange={(e) => {
              const file = e.target.files[0];
              const error = validateFile(file);

              if (error) {
                setErrorMsg(error);
                return;
              }

              setErrorMsg("");
              setForm({ ...form, file });
            }}
          />
        </label>

        {errorMsg && (
          <p className="text-red-500 text-sm text-center">
            {errorMsg}
          </p>
        )}

        {successMsg && (
          <p className="text-green-500 text-sm text-center">
            {successMsg}
          </p>
        )}

        <input
          placeholder="Title"
          className="w-full border p-2 rounded"
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <textarea
          placeholder="Description"
          className="w-full border p-2 rounded"
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <div>
          <p className="text-sm font-medium mb-1">Categories</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_OPTIONS.map((cat) => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`px-2 py-1 rounded-full text-sm border ${
                  form.categories.includes(cat)
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div>
          <input
            placeholder="Add tags (press Enter)"
            className="w-full border p-2 rounded"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={addTag}
          />

          <div className="flex flex-wrap gap-2 mt-2">
            {form.tags.map((tag, i) => (
              <span
                key={i}
                className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full text-xs cursor-pointer"
                onClick={() => removeTag(tag)}
              >
                #{tag} ✕
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <button onClick={onClose} className="text-gray-600 font-semibold">
            Cancel
          </button>

          <button
            onClick={upload}
            disabled={loading}
            className="bg-indigo-500 active:scale-95 text-white px-4 py-2 rounded-lg"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}