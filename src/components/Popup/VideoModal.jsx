// components/Popup/VideoModal.js
import React from "react";

const VideoModal = ({
  candidate,
  videoUrl,
  onClose,
  onStatusChange,
  error,
}) => {
  console.log("VideoModal videoUrl:", videoUrl);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="size-6"
          >
            <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
          </svg>
        </button>
        {error ? (
          <div className="text-red-500">Video bulunamadı.</div>
        ) : (
          <video width="100%" controls>
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        <div className="mt-4 flex justify-between">
          <button
            onClick={() => onStatusChange(candidate._id, "passed")}
            className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded"
          >
            Accept
          </button>
          <button
            onClick={() => onStatusChange(candidate._id, "failed")}
            className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;