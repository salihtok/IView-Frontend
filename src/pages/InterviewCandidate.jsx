import React, { useState, useEffect } from "react";
import { ReactMediaRecorder } from "react-media-recorder";
import Webcam from "react-webcam";
import useLinkStore from "../store/linkStore";
import useVideoStore from "../store/videoStore";

const InterviewPage = ({ interview, formData }) => {
  const { submitInterview } = useLinkStore();
  const { uploadVideo } = useVideoStore();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [videoStarted, setVideoStarted] = useState(false);
  const [videoStopped, setVideoStopped] = useState(false);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState(null);

  const questions =
    interview?.questionPackage?.flatMap((pkg) => pkg.questions) || [];

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

  const handleUploadVideo = async (videoBlobUrl) => {
    try {
      const response = await fetch(videoBlobUrl);
      const blob = await response.blob();
      const videoFile = new File([blob], "recording.mp4", {
        type: "video/mp4",
      });
      console.log("Video dosyası:", videoFile);
      const videoUrl = await uploadVideo(videoFile);
      setUploadedVideoUrl(videoUrl);
      console.log("Video URL:", videoUrl);
    } catch (error) {
      console.error("Video yüklenirken hata oluştu:", error);
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
      window.location.reload(); // Sayfayı yenileyerek form sayfasına dön
    } catch (error) {
      console.error("Mülakat kaydedilirken hata:", error);
      alert("Mülakat kaydedilirken hata oluştu.");
    }
  };

  if (questions.length === 0) return <div>Soru bulunamadı...</div>;

  return (
    <div className="flex flex-col items-center p-6 space-y-4 bg-gray-100">
      <h2 className="text-2xl font-bold">Mülakat Soruları</h2>

      {/* Video ve Butonlar */}
      <ReactMediaRecorder
        video
        render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
          <div className="flex flex-col items-center w-full max-w-2xl bg-white shadow rounded-lg p-4">
            <h3 className="font-semibold">Video {status}</h3>
            <Webcam audio={false} className="rounded-lg mb-4" />
            {!videoStarted && !videoStopped && (
              <button
                onClick={() => {
                  setVideoStarted(true);
                  startRecording();
                }}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Videoyu Başlat
              </button>
            )}
            {videoStarted && currentQuestionIndex === questions.length - 1 && (
              <button
                onClick={() => {
                  setVideoStarted(false);
                  setVideoStopped(true); // Mark video as stopped
                  stopRecording();
                  handleUploadVideo(mediaBlobUrl);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Kaydı Bitir
              </button>
            )}
            {uploadedVideoUrl && (
              <button
                onClick={handleCompleteInterview}
                className="px-4 py-2 bg-purple-500 text-white rounded mt-4"
              >
                Mülakatı Tamamla
              </button>
            )}
          </div>
        )}
      />

      {/* Sorular */}
      {videoStarted && (
        <div className="w-full max-w-2xl p-4 bg-white shadow rounded-lg mt-4">
          <h3 className="font-semibold">Soru {currentQuestionIndex + 1}</h3>
          <p>{questions[currentQuestionIndex]?.text}</p>
          <div className="text-sm text-gray-600 mt-2">
            <span>
              Kalan Süre: {Math.floor(timeLeft / 60)}:{timeLeft % 60}
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
