import { useState, useEffect } from "react";

const InterviewPage = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(
    questions[currentQuestionIndex].time
  );
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);

  const questions = [
    { text: "Tell us about yourself.", time: 120 },
    { text: "Why are you interested in this position?", time: 180 },
    { text: "What is your greatest strength?", time: 150 },
  ];

  useEffect(() => {
    if (isInterviewStarted && timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timerId);
    } else if (timeLeft === 0 && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setTimeLeft(questions[currentQuestionIndex + 1].time);
    }
  }, [isInterviewStarted, timeLeft, currentQuestionIndex, questions]);

  const startInterview = () => {
    setIsInterviewStarted(true);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Interview Questions</h2>
          <div className="flex space-x-4">
            <div>
              <span className="text-gray-600">Question:</span>
              <span>{currentQuestionIndex + 1}</span>/{questions.length}
            </div>
            <div>
              <span className="text-gray-600">Time:</span>
              <span>
                {Math.floor(timeLeft / 60)
                  .toString()
                  .padStart(2, "0")}
                :{(timeLeft % 60).toString().padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>

        <div className="flex space-x-8">
          {/* Video Alanı */}
          <div className="flex-1 bg-gray-200 rounded-lg">
            <video className="w-full h-full rounded-lg" controls />
          </div>

          {/* Sorular Alanı */}
          <div className="w-1/3">
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div
                  key={index}
                  className={
                    index === currentQuestionIndex
                      ? "text-lg font-bold"
                      : "text-sm"
                  }
                >
                  {question.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {!isInterviewStarted && (
          <div className="mt-6 text-right">
            <button
              onClick={startInterview}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Start Interview
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewPage;