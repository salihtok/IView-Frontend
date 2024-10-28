// InterviewPage.js
import React, { useState, useEffect } from "react";
import { ReactMediaRecorder } from "react-media-recorder";
import Webcam from "react-webcam";
import useLinkStore from "../store/linkStore";
import useVideoStore from "../store/videoStore";

const InterviewPage = ({ interview, formData }) => {
  const { submitInterview } = useLinkStore(); // submitInterview fonksiyonu
  const { uploadVideo, loading, error } = useVideoStore(); // uploadVideo fonksiyonu
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [videoStarted, setVideoStarted] = useState(false);
  const questions = interview?.questionPackage?.[0]?.questions || [];

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      const { minutes, seconds } = questions[currentQuestionIndex + 1].questionTime;
      setTimeLeft(minutes * 60 + seconds);
    } else {
      alert("Mülakat sona erdi.");
      setVideoStarted(false); // Video sona erdiğinde durdur
    }
  };

  const handleSkipQuestion = () => goToNextQuestion();

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

    if (timeLeft === 0) {
      goToNextQuestion();
    }

    return () => clearInterval(timer);
  }, [timeLeft, videoStarted]);

  const handleSubmitInterview = async (videoUrl) => {
    try {
      await submitInterview({
        interviewId: interview._id,
        ...formData,
        videoUrl, // Oluşan video URL'sini dahil ediyoruz
      });
      alert("Mülakat başarıyla tamamlandı.");
    } catch (error) {
      alert("Mülakat kaydedilirken hata oluştu.");
    }
  };

  const handleUploadVideo = async (videoBlobUrl) => {
    // videoBlobUrl'den File oluşturuyoruz
    const response = await fetch(videoBlobUrl);
    const blob = await response.blob();
    const videoFile = new File([blob], "recording.mp4", { type: "video/mp4" });

    const videoData = await uploadVideo(videoFile); // Video'yu yükle
    if (videoData) {
      handleSubmitInterview(videoData.fileUrl); // Video URL'sini gönder
    }
  };

  if (questions.length === 0) return <div>Soru bulunamadı...</div>;

  return (
    <div className="flex flex-col items-center p-6 space-y-4 bg-gray-100">
      <h2 className="text-2xl font-bold">Mülakat Soruları</h2>
      <div className="flex justify-between w-full max-w-2xl">
        <div className="flex-1 p-4 bg-white shadow rounded-lg">
          <h3 className="font-semibold">Soru {currentQuestionIndex + 1}</h3>
          <p>{questions[currentQuestionIndex].text}</p>
          <div className="text-sm text-gray-600 mt-2">
            <span>
              Kalan Süre: {Math.floor(timeLeft / 60)}:{timeLeft % 60}
            </span>
          </div>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleSkipQuestion}
          >
            Soruyu Atla
          </button>
        </div>

        <ReactMediaRecorder
          video
          render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
            <div className="flex-1 p-4 bg-white shadow rounded-lg">
              <h3 className="font-semibold">Video {status}</h3>
              <Webcam audio={false} className="rounded-lg" />
              {!videoStarted ? (
                <button
                  onClick={() => {
                    setVideoStarted(true);
                    startRecording();
                  }}
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
                >
                  Videoyu Başlat
                </button>
              ) : (
                <button
                  onClick={() => {
                    setVideoStarted(false);
                    stopRecording();
                    handleUploadVideo(mediaBlobUrl); // Kaydı yükle
                  }}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
                >
                  Kaydı Bitir
                </button>
              )}
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default InterviewPage;