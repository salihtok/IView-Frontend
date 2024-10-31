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
  const [isUploading, setIsUploading] = useState(false); // New loading state

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
    if (mediaBlobUrl) {
      console.log("mediaBlobUrl mevcut:", mediaBlobUrl);
      handleUploadVideo();
    }
  }, [mediaBlobUrl]);

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      const { minutes, seconds } =
        questions[currentQuestionIndex + 1].questionTime;
      setTimeLeft(minutes * 60 + seconds);
    }
  };

  const handleSkipQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      goToNextQuestion();
    }
  };

  const handleUploadVideo = async () => {
    if (!mediaBlobUrl) {
      console.error("Video Blob URL bulunamadı.");
      return;
    }
    console.log("Uploading video from URL:", mediaBlobUrl);
    setIsUploading(true); // Set loading state to true
    try {
      const response = await fetch(mediaBlobUrl);
      if (!response.ok) throw new Error("Video yüklenirken hata oluştu.");
      const blob = await response.blob();
      const videoFile = new File([blob], "recording.mp4", {
        type: "video/mp4",
      });
      console.log("VideoFile uploadtan önce:", videoFile);
      const videoUrl = await uploadVideo(videoFile);
      if (!videoUrl) throw new Error("Video URL alınamadı.");
      setUploadedVideoUrl(videoUrl);
      console.log("Video URL uploadtan sonra:", videoUrl);
    } catch (error) {
      console.error("Video yüklenirken hata oluştu:", error);
    } finally {
      setIsUploading(false); // Reset loading state after upload completes
    }
  };

  const handleCompleteInterview = async () => {
    if (!uploadedVideoUrl) {
      alert("Videoyu yüklemeyi tamamlayın.");
      return;
    }

    try {
      await submitInterview({
        interviewId: interview._id,
        ...formData,
        videoUrl: uploadedVideoUrl,
      });
      alert("Mülakat başarıyla tamamlandı.");
      window.location.reload();
    } catch (error) {
      console.error("Mülakat kaydedilirken hata:", error);
      alert("Mülakat kaydedilirken hata oluştu.");
    }
  };

  const handleStopRecording = () => {
    setRecordingStopped(true);
    setVideoStarted(false);
    setCurrentQuestionIndex(0);
    setTimeLeft(null); // Zamanlayıcıyı sıfırlayın
  };

  if (questions.length === 0) return <div>Soru bulunamadı...</div>;

  return (
    <div className="flex flex-col items-center p-6 space-y-4 bg-gray-100">
      <h2 className="text-2xl font-bold">Mülakat Soruları</h2>

      <ReactMediaRecorder
        video
        onStop={(blobUrl) => {
          setMediaBlobUrl(blobUrl);
          handleStopRecording();
        }}
        render={({ status, startRecording, stopRecording }) => (
          <div className="flex flex-col items-center w-full max-w-2xl bg-white shadow rounded-lg p-4">
            <h3 className="font-semibold">Video {status}</h3>
            <Webcam audio={false} className="rounded-lg mb-4" />
            {!videoStarted &&
              !recordingStopped && ( // Durdurulmamış ve başlanmamışsa
                <button
                  onClick={() => {
                    setVideoStarted(true);
                    setRecordingStopped(false);
                    startRecording();
                    console.log("Video kaydı başlatıldı");
                  }}
                  className="px-4 py-2 bg-green-500 text-white rounded"
                >
                  Videoyu Başlat
                </button>
              )}
            {videoStarted && !recordingStopped && (
              <button
                onClick={() => {
                  stopRecording();
                  console.log("Video kaydı durduruldu");
                }}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Kaydı Bitir
              </button>
            )}
            {recordingStopped &&
              uploadedVideoUrl && ( // Durdurulduysa ve video yüklendiyse
                <button
                  onClick={handleCompleteInterview}
                  className="px-4 py-2 bg-purple-500 text-white rounded mt-4"
                >
                  Mülakatı Tamamla
                </button>
              )}
            {recordingStopped &&
              isUploading && ( // Loading message while uploading
                <div className="mt-4 text-yellow-600">
                  Videonuz yükleniyor. Lütfen bekleyin...
                </div>
              )}
          </div>
        )}
      />

      {videoStarted && !recordingStopped && (
        <div className="w-full max-w-2xl p-4 bg-white shadow rounded-lg mt-4">
          <h3 className="font-semibold">Soru {currentQuestionIndex + 1}</h3>
          <p>{questions[currentQuestionIndex]?.text}</p>
          <div className="text-sm text-gray-600 mt-2">
            <span>
              Kalan Süre: {Math.floor(timeLeft / 60)}:
              {String(timeLeft % 60).padStart(2, "0")}
            </span>
          </div>
          {currentQuestionIndex < questions.length - 1 && (
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={handleSkipQuestion}
            >
              Soruyu Atla
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default InterviewPage;
