import { useState, useEffect } from "react";
import useQuestionsStore from "../../store/questionStore";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const AddQuestionPopup = ({ onClose, selectedQuestion }) => {
  const [question, setQuestion] = useState(selectedQuestion?.text || "");
  const [questionTime, setQuestionTime] = useState({
    minutes: selectedQuestion?.questionTime?.minutes || 0,
    seconds: selectedQuestion?.questionTime?.seconds || 0,
  });
  const [errors, setErrors] = useState({});

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

  const validateForm = () => {
    const newErrors = {};
    
    if (!question.trim()) {
      newErrors.question = "Question text is required";
    }
    
    if (questionTime.minutes === 0 && questionTime.seconds === 0) {
      newErrors.time = "Please set a time limit";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting');
      return;
    }
    
    const questionData = { text: question, questionTime };

    try {
      if (selectedQuestion) {
        updateQuestion(selectedQuestion._id, questionData);
        toast.success('Question updated successfully!');
      } else {
        createQuestion(questionData);
        toast.success('Question added successfully!');
      }
      onClose();
    } catch (error) {
      toast.error('An error occurred while saving the question');
    }
  };

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50 p-4"
      onClick={handleOutsideClick}
    >
      <div 
        className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-[600px] max-h-[90vh] flex flex-col"
        onClick={handleContentClick}
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-4">
          {selectedQuestion ? "Update Question" : "Add Question"}
        </h2>

        <div className="mb-6">
          <label className="block font-medium mb-2">Question</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 min-h-[120px]"
            placeholder="Input your question here..."
            rows="4"
          ></textarea>
          {errors.question && (
            <p className="text-red-500 text-sm mt-1">{errors.question}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block font-medium mb-2">Minutes</label>
            <input
              type="number"
              value={questionTime.minutes}
              onChange={(e) =>
                setQuestionTime({
                  ...questionTime,
                  minutes: parseInt(e.target.value, 10) || 0,
                })
              }
              className="w-full border border-gray-300 rounded-lg p-2 sm:p-3"
              min="0"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Seconds</label>
            <input
              type="number"
              value={questionTime.seconds}
              onChange={(e) =>
                setQuestionTime({
                  ...questionTime,
                  seconds: parseInt(e.target.value, 10) || 0,
                })
              }
              className="w-full border border-gray-300 rounded-lg p-2 sm:p-3"
              min="0"
              max="59"
              placeholder="0"
            />
          </div>
          {errors.time && (
            <p className="text-red-500 text-sm mt-1 col-span-2">{errors.time}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 mt-auto pt-2 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 w-full sm:w-auto"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!question.trim() || (questionTime.minutes === 0 && questionTime.seconds === 0)}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg w-full sm:w-auto ${
              !question.trim() || (questionTime.minutes === 0 && questionTime.seconds === 0)
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-[#30847f] hover:bg-[#277571] text-white'
            }`}
          >
            {selectedQuestion ? "Update" : "Add"}
          </button>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default AddQuestionPopup;
