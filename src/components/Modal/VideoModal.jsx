import React, { useState } from "react";

const VideoModal = ({
  candidate,
  videoUrl,
  onClose,
  onStatusChange,
  error,
}) => {
  const [showTranscription, setShowTranscription] = useState(false);
  const transcription = candidate?.result?.transcription;

  const formatTranscription = (text) => {
    if (!text) return null;

    // Paragrafları ayır
    const sentences = text.split(/(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s/); // Noktadan sonra ayır
    return sentences.map((sentence, index) => (
      <p key={index} className="mb-4 text-lg text-gray-700">
        {sentence}
      </p>
    ));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg flex w-full max-w-5xl relative">
        {/* Sol Taraf: Video ve Butonlar */}
        <div className="w-2/3 p-6">
          <button
            onClick={onClose}
            className="absolute top-1 right-1 text-gray-500 hover:text-gray-700"
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
            <>
              <video width="100%" controls className="rounded-lg mb-4">
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Accept ve Reject Butonları */}
              <div className="mt-4 flex justify-between space-x-4">
                <button
                  onClick={() => onStatusChange(candidate._id, "passed")}
                  className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded shadow-lg"
                >
                  Accept
                </button>
                <button
                  onClick={() => onStatusChange(candidate._id, "failed")}
                  className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded shadow-lg"
                >
                  Reject
                </button>
              </div>
            </>
          )}
        </div>

        {/* Sağ Taraf: Transcription Butonu ve İçeriği */}
        <div className="w-1/3 border-l border-gray-400 p-6 flex flex-col">
          {/* Transcription Butonu */}
          <button
            onClick={() => setShowTranscription(!showTranscription)}
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded shadow-lg mb-4"
          >
            {showTranscription ? "Hide Transcription" : "Show Transcription"}
          </button>

          {/* Transcription İçeriği */}
          {showTranscription && (
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Transcription
              </h3>
              {transcription ? (
                <div className="overflow-y-auto max-h-[55vh]">
                  {formatTranscription(transcription)}
                </div>
              ) : (
                <div className="text-gray-600">
                  Transcription is not available.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoModal;