import { useState, useEffect } from "react";
import useQuestionsStore from "../../store/questionStore";

const AddQuestionPopup = ({ onClose, selectedQuestion }) => {
  const [question, setQuestion] = useState(selectedQuestion?.text || "");
  const [questionTime, setQuestionTime] = useState({
    minutes: selectedQuestion?.questionTime?.minutes || 0,
    seconds: selectedQuestion?.questionTime?.seconds || 0,
  });

  const { createQuestion, updateQuestion } = useQuestionsStore();

  useEffect(() => {
    if (selectedQuestion) {
      setQuestion(selectedQuestion.text);
      setQuestionTime({
        minutes: selectedQuestion.questionTime.minutes,
        seconds: selectedQuestion.questionTime.seconds,
      });
    }
  }, [selectedQuestion]);

  const handleSave = () => {
    // Verileri konsolda kontrol edin
    console.log("Question Time (Before Save):", questionTime);

    const questionData = { text: question, questionTime };

    // Gönderilen veriyi kontrol edin
    console.log("Sending questionData:", questionData);

    if (selectedQuestion) {
      // Güncelleme işlemi
      updateQuestion(selectedQuestion._id, questionData);
    } else {
      // Yeni soru ekleme işlemi
      createQuestion(questionData);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
        <h2 className="text-lg font-bold mb-4">
          {selectedQuestion ? "Update Question" : "Add Question"}
        </h2>
        <div className="mb-4">
          <label className="block font-medium mb-1">Question</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full border-gray-300 rounded-lg p-2"
            placeholder="Input..."
            rows="3"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Duration (minutes)</label>
          <input
            type="number"
            value={questionTime.minutes}
            onChange={(e) =>
              setQuestionTime({
                ...questionTime,
                minutes: parseInt(e.target.value, 10) || 0,
              })
            }
            className="w-full border-gray-300 rounded-lg p-2"
            min="0"
            placeholder="Minutes"
          />

          <label className="block font-medium mb-1 mt-4">
            Duration (seconds)
          </label>
          <input
            type="number"
            value={questionTime.seconds}
            onChange={(e) =>
              setQuestionTime({
                ...questionTime,
                seconds: parseInt(e.target.value, 10) || 0,
              })
            }
            className="w-full border-gray-300 rounded-lg p-2"
            min="0"
            max="59"
            placeholder="Seconds"
          />
        </div>
        <div className="flex justify-between">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white p-2 rounded w-2/5"
          >
            {selectedQuestion ? "Update" : "Add"}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white p-2 rounded w-2/5"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddQuestionPopup;
