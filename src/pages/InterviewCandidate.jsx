import React, { useState, useEffect } from "react";
import { ReactMediaRecorder } from "react-media-recorder";
import Webcam from "react-webcam";
import useCandidateStore from "../store/candidateStore";
import useVideoStore from "../store/videoStore";

const InterviewPage = ({ interview, formData }) => {
  const { submitInterview } = useCandidateStore();
  const { uploadVideo } = useVideoStore();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [videoStarted, setVideoStarted] = useState(false);
  const [recordingStopped, setRecordingStopped] = useState(false);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState(null);
  const [mediaBlobUrl, setMediaBlobUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const questions =
    interview?.questionPackage?.flatMap((pkg) => pkg.questions) || [];

  useEffect(() => {
    if (questions.length > 0 && timeLeft === null) {
      const { minutes, seconds } = questions[0].questionTime;
      setTimeLeft(minutes * 60 + seconds);
    }
  }, [questions, timeLeft]);

  useEffect(() => {
    if (timeLeft === null || !videoStarted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    if (timeLeft === 0 && currentQuestionIndex < questions.length - 1) {
      goToNextQuestion();
    }

    return () => clearInterval(timer);
  }, [timeLeft, videoStarted]);

  useEffect(() => {
    if (mediaBlobUrl) handleUploadVideo();
  }, [mediaBlobUrl]);

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      const { minutes, seconds } =
        questions[currentQuestionIndex + 1].questionTime;
      setTimeLeft(minutes * 60 + seconds);
    }
  };

  const handleSkipQuestion = () => goToNextQuestion();

  const handleUploadVideo = async () => {
    if (!mediaBlobUrl) return;
    setIsUploading(true);

    try {
      const response = await fetch(mediaBlobUrl);
      if (!response.ok) throw new Error("Error during video upload.");
      const blob = await response.blob();
      const videoFile = new File([blob], "recording.mp4", {
        type: "video/mp4",
      });
      const videoUrl = await uploadVideo(videoFile);
      setUploadedVideoUrl(videoUrl);
    } catch (error) {
      console.error("Video upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCompleteInterview = async () => {
    if (!uploadedVideoUrl) {
      alert("Please wait for the video to finish uploading.");
      return;
    }

    try {
      await submitInterview({
        interviewId: interview._id,
        ...formData,
        videoUrl: uploadedVideoUrl,
      });
      alert("Interview completed successfully.");
      window.location.reload();
    } catch (error) {
      console.error("Error completing interview:", error);
      alert("An error occurred during interview completion.");
    }
  };

  const handleStopRecording = () => {
    setRecordingStopped(true);
    setVideoStarted(false);
    setCurrentQuestionIndex(0);
    setTimeLeft(null);
  };

  const calculateProgress = () => {
    if (!questions[currentQuestionIndex]) return 0;
    const { minutes, seconds } = questions[currentQuestionIndex].questionTime;
    const totalTime = minutes * 60 + seconds;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  if (questions.length === 0) return <div>No questions available...</div>;

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 overflow-hidden">
      <ReactMediaRecorder
        video
        onStop={(blobUrl) => {
          setMediaBlobUrl(blobUrl);
          handleStopRecording();
        }}
        render={({ status, startRecording, stopRecording }) => (
          <div className="relative w-3/5 h-[85%] bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col items-center">
            {videoStarted && !recordingStopped && (
              <div className="absolute top-0 left-0 right-0 z-10">
                <div className="relative w-full bg-gray-700/50 h-4 backdrop-blur-sm">
                  <div
                    className="h-full bg-gradient-to-r from-gray-100 to-white transition-all duration-300 ease-out"
                    style={{ 
                      width: `${calculateProgress()}%`,
                      boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)'
                    }}
                  >
                    <div className="h-full w-full bg-[rgba(255,255,255,0.2)]"></div>
                  </div>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-800/80 px-3 py-0.5 rounded-full text-xs text-white font-medium backdrop-blur-sm">
                    {currentQuestionIndex + 1}/{questions.length}
                  </div>
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex gap-2">
                    {questions.map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 w-2 rounded-full ${
                          index === currentQuestionIndex
                            ? 'bg-red-500'
                            : index < currentQuestionIndex
                            ? 'bg-red-300'
                            : 'bg-red-900'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <h3 className="absolute top-6 text-white font-semibold">
              {status}
            </h3>
            <Webcam
              audio={false}
              className="absolute w-full h-full object-cover"
            />
            <div className="justify-center absolute bottom-0 left-0 right-0 bg-opacity-75 bg-gray-900 text-white px-4 py-6">
              <div className="max-w-xl mx-auto">
                <div className="flex py-4">
                  {!videoStarted && !recordingStopped && (
                    <button
                      onClick={() => {
                        setVideoStarted(true);
                        setRecordingStopped(false);
                        startRecording();
                      }}
                      className="mx-auto px-4 py-2 bg-green-600 text-white rounded"
                    >
                      Start Video
                    </button>
                  )}
                </div>

                {videoStarted && !recordingStopped && (
                  <div className="flex items-center justify-between w-full text-center space-x-4 py-4">
                    <div className="flex-grow text-center">
                      <h4 className="font-semibold text-lg inline-flex items-center gap-2">
                        Question {currentQuestionIndex + 1}
                        <span className="text-sm text-gray-400 ml-2">
                          {Math.floor(timeLeft / 60)}:
                          {String(timeLeft % 60).padStart(2, "0")}
                        </span>
                      </h4>
                      <p>{questions[currentQuestionIndex]?.text}</p>
                    </div>

                    {currentQuestionIndex < questions.length - 1 ? (
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                        onClick={handleSkipQuestion}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          className="size-6"
                        >
                          <path d="M2.53 3.956A1 1 0 0 0 1 4.804v6.392a1 1 0 0 0 1.53.848l5.113-3.196c.16-.1.279-.233.357-.383v2.73a1 1 0 0 0 1.53.849l5.113-3.196a1 1 0 0 0 0-1.696L9.53 3.956A1 1 0 0 0 8 4.804v2.731a.992.992 0 0 0-.357-.383L2.53 3.956Z" />
                        </svg>
                      </button>
                    ) : (
                      <button
                        className="px-4 py-2 bg-green-600 text-white rounded"
                        onClick={() => stopRecording()}
                      >
                        Complete Video
                      </button>
                    )}
                  </div>
                )}
                {recordingStopped && uploadedVideoUrl && (
                  <div className="flex justify-center w-full mt-4">
                    <button
                      onClick={handleCompleteInterview}
                      className="py-3 w-1/3 bg-purple-600 text-white rounded"
                    >
                      Complete Interview
                    </button>
                  </div>
                )}

                {recordingStopped && isUploading && (
                  <div className="flex justify-center w-full mt-4 text-yellow-400">
                    Uploading video... Please wait.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default InterviewPage;
