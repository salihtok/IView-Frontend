import { useState, useEffect } from "react";
import PropTypes from "prop-types"; // PropTypes'ı içe aktar
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
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✖
        </button>
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
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          {selectedQuestion ? "Update" : "Add"}
        </button>
      </div>
    </div>
  );
};

// PropTypes tanımları
AddQuestionPopup.propTypes = {
  onClose: PropTypes.func.isRequired,
  selectedQuestion: PropTypes.shape({
    _id: PropTypes.string,
    text: PropTypes.string,
    questionTime: PropTypes.shape({
      minutes: PropTypes.number,
      seconds: PropTypes.number,
    }),
  }),
};

export default AddQuestionPopup;