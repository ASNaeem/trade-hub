import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

const DocumentUpload = () => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");

  const onDrop = (acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      setError("Unsupported file type. Please upload PDF, DOCX, or JPG files.");
    } else {
      setError("");
      const filesWithPreview = acceptedFiles.map((file) => {
        if (file.type.startsWith("image/")) {
          file.preview = URL.createObjectURL(file);
        }
        return file;
      });
      setFiles((prev) => [...prev, ...filesWithPreview]);
    }
  };

  const removeFile = (fileToRemove) => {
    setFiles((prev) => prev.filter((file) => file !== fileToRemove));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
  });

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={`flex justify-center items-center p-4 border-2 border-dashed transition-all hover:bg-gray-50 hover:border-gray-400 border-gray-300 rounded-md cursor-pointer ${
          isDragActive ? "bg-blue-100 border-blue-400" : ""
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-sm text-gray-500">
          Drag & drop files here, or click to select files
        </p>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <ul className="space-y-1">
        {files.map((file, index) => (
          <li
            key={index}
            className="flex items-center justify-between text-sm text-gray-700"
          >
            {file.type.startsWith("image/") ? (
              <img
                src={file.preview}
                alt={file.name}
                className="w-16 h-16 object-cover"
              />
            ) : (
              <p>{file.name}</p>
            )}
            <button
              onClick={() => removeFile(file)}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DocumentUpload;
