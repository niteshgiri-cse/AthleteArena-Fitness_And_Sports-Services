import { useState } from "react";
import { UploadCloud } from "lucide-react";

import {
  uploadImage,
  uploadVideo,
} from "@/api/mediaApi";

const CATEGORY_OPTIONS = [
  "SPORT",
  "FITNESS",
  "INDOOR",
  "OUTDOOR",
  "SPORTS",
  "OTHER",
];

export default function UploadModal({
  type,
  setPosts,
  onClose,
}) {

  const [form, setForm] = useState({
    file: null,
    title: "",
    description: "",
    categories: [],
    tags: [],
  });

  const [tagInput, setTagInput] =
    useState("");

  const [errorMsg, setErrorMsg] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [successMsg, setSuccessMsg] =
    useState("");

  // ================= FILE VALIDATION =================

  const validateFile = (file) => {

    if (!file)
      return "Please choose a file first";

    const imageTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    const videoTypes = [
      "video/mp4",
      "video/webm",
      "video/ogg",
    ];

    const maxImageSize =
      5 * 1024 * 1024;

    const maxVideoSize =
      50 * 1024 * 1024;

    // image
    if (type === "image") {

      if (!imageTypes.includes(file.type)) {

        return "Please upload JPG, PNG or WEBP image";
      }

      if (file.size > maxImageSize) {

        return "Image must be smaller than 5MB";
      }
    }

    // video
    if (type === "video") {

      if (!videoTypes.includes(file.type)) {

        return "Please upload MP4, WEBM or OGG video";
      }

      if (file.size > maxVideoSize) {

        return "Video must be smaller than 50MB";
      }
    }

    return null;
  };

  // ================= TAGS =================

  const addTag = (e) => {

    if (
      e.key === "Enter" &&
      tagInput.trim()
    ) {

      e.preventDefault();

      if (
        !form.tags.includes(
          tagInput.trim()
        )
      ) {

        setForm({
          ...form,
          tags: [
            ...form.tags,
            tagInput.trim(),
          ],
        });
      }

      setTagInput("");
    }
  };

  const removeTag = (tag) => {

    setForm({
      ...form,
      tags: form.tags.filter(
        (t) => t !== tag
      ),
    });
  };

  // ================= CATEGORY =================

  const toggleCategory = (cat) => {

    if (form.categories.includes(cat)) {

      setForm({
        ...form,
        categories:
          form.categories.filter(
            (c) => c !== cat
          ),
      });

    } else {

      setForm({
        ...form,
        categories: [
          ...form.categories,
          cat,
        ],
      });
    }
  };

  // ================= UPLOAD =================

  const upload = async () => {

    const error =
      validateFile(form.file);

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
        description:
          form.description,
        category:
          form.categories,
        tags: form.tags,
      };

      let uploadedPost;

      // image upload
      if (type === "image") {

        uploadedPost =
          await uploadImage(payload);

      } else {

        uploadedPost =
          await uploadVideo(payload);
      }

      console.log(
        "UPLOADED POST:",
        uploadedPost
      );

      // ✅ IMPORTANT FIX
      // upload api already returns object directly
      if (
        uploadedPost &&
        uploadedPost.id &&
        typeof setPosts ===
          "function"
      ) {

        setPosts((prev) => {

          const safePrev =
            Array.isArray(prev)
              ? prev.filter(
                  (item) =>
                    item &&
                    item.id
                )
              : [];

          return [
            uploadedPost,
            ...safePrev,
          ];
        });
      }

      setSuccessMsg(
        "✅ Upload successful"
      );

      // close modal
      setTimeout(() => {
        onClose();
      }, 500);

    } catch (error) {

      console.log(error);

      setErrorMsg(
        error?.response?.data
          ?.message ||
          error?.message ||
          "Upload failed"
      );

    } finally {

      setLoading(false);
    }
  };

  // ================= UI =================

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white p-6 rounded-2xl w-full max-w-md space-y-4">

        <h2 className="text-xl font-semibold text-center">

          Upload{" "}

          {type === "image"
            ? "Image"
            : "Video"}

        </h2>

        {/* FILE */}
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

              const file =
                e.target.files[0];

              const error =
                validateFile(file);

              if (error) {

                setErrorMsg(error);

                return;
              }

              setErrorMsg("");

              setForm({
                ...form,
                file,
              });
            }}
          />
        </label>

        {/* ERROR */}
        {errorMsg && (

          <p className="text-red-500 text-sm text-center">

            {errorMsg}

          </p>

        )}

        {/* SUCCESS */}
        {successMsg && (

          <p className="text-green-500 text-sm text-center">

            {successMsg}

          </p>

        )}

        {/* TITLE */}
        <input
          placeholder="Title"
          className="w-full border p-2 rounded"
          onChange={(e) =>
            setForm({
              ...form,
              title:
                e.target.value,
            })
          }
        />

        {/* DESCRIPTION */}
        <textarea
          placeholder="Description"
          className="w-full border p-2 rounded"
          onChange={(e) =>
            setForm({
              ...form,
              description:
                e.target.value,
            })
          }
        />

        {/* CATEGORIES */}
        <div>

          <p className="text-sm font-medium mb-1">
            Categories
          </p>

          <div className="flex flex-wrap gap-2">

            {CATEGORY_OPTIONS.map(
              (cat) => (

                <button
                  key={cat}
                  type="button"
                  onClick={() =>
                    toggleCategory(
                      cat
                    )
                  }
                  className={`px-2 py-1 rounded-full text-sm border ${
                    form.categories.includes(
                      cat
                    )
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  {cat}
                </button>

              )
            )}
          </div>
        </div>

        {/* TAGS */}
        <div>

          <input
            placeholder="Add tags (press Enter)"
            className="w-full border p-2 rounded"
            value={tagInput}
            onChange={(e) =>
              setTagInput(
                e.target.value
              )
            }
            onKeyDown={addTag}
          />

          <div className="flex flex-wrap gap-2 mt-2">

            {form.tags.map(
              (tag, i) => (

                <span
                  key={i}
                  className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full text-xs cursor-pointer"
                  onClick={() =>
                    removeTag(tag)
                  }
                >
                  #{tag} ✕
                </span>

              )
            )}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-between items-center pt-2">

          <button
            onClick={onClose}
            className="text-gray-600 font-semibold"
          >
            Cancel
          </button>

          <button
            onClick={upload}
            disabled={loading}
            className="bg-indigo-500 active:scale-95 text-white px-4 py-2 rounded-lg"
          >
            {loading
              ? "Uploading..."
              : "Upload"}
          </button>

        </div>
      </div>
    </div>
  );
}