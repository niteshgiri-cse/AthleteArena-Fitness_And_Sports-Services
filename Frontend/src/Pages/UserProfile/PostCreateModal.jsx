import { useRef } from "react";
import { X } from "lucide-react";

export default function PostCreateModal({
  onClose,
  title,
  setTitle,
  text,
  setText,
  tagsInput,
  setTagsInput,
  handleFiles,
  files,
  progress,
  createPost
}) {
  const fileRef = useRef();

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl p-6 relative">

        <X className="absolute right-4 top-4 cursor-pointer" onClick={onClose} />

        <h2 className="text-lg font-bold mb-4">Create Post</h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title"
          className="w-full border rounded-full px-4 py-2 mb-2"
        />

        <input
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="Tags (comma separated)"
          className="w-full border rounded-full px-4 py-2 mb-2"
        />

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Description"
          className="w-full border rounded-xl px-4 py-2 mb-3"
        />

        <div
          onClick={() => fileRef.current.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFiles([...e.dataTransfer.files]);
          }}
          className="border-2 border-dashed p-5 text-center rounded-xl cursor-pointer mb-3"
        >
          Drag & drop media or click
        </div>

        <input
          hidden
          multiple
          ref={fileRef}
          type="file"
          onChange={(e) => handleFiles([...e.target.files])}
        />

        {files.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-3">
            {files.map((f, i) =>
              f.type.startsWith("video") ? (
                <video key={i} src={URL.createObjectURL(f)} className="h-24 w-full object-cover rounded"/>
              ) : (
                <img key={i} src={URL.createObjectURL(f)} className="h-24 w-full object-cover rounded"/>
              )
            )}
          </div>
        )}

        {progress > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progress}%` }} />
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-full">
            Cancel
          </button>

          <button
            onClick={createPost}
            className="px-6 py-2 bg-blue-600 text-white rounded-full"
          >
            Post
          </button>
        </div>

      </div>
    </div>
  );
}