import { useRef } from "react";

export default function MediaUploader({ onFiles }) {
  const inputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    onFiles([...e.dataTransfer.files]);
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="border-2 border-dashed p-6 text-center rounded-xl cursor-pointer"
      onClick={() => inputRef.current.click()}
    >
      Drag & drop or click to upload
      <input
        multiple
        hidden
        ref={inputRef}
        type="file"
        onChange={(e) => onFiles([...e.target.files])}
      />
    </div>
  );
}