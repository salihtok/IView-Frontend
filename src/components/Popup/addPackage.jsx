import { useEffect, useState } from "react";
import useQuestionsStore from "../../store/questionStore";

const AddPackagePopup = ({ onClose, onAdd }) => {
  const [packageName, setPackageName] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  // Accessing questions from the Zustand store
  const { questions, fetchQuestions } = useQuestionsStore();

  useEffect(() => {
    fetchQuestions(); // Fetch the questions when the popup opens
  }, [fetchQuestions]);

  const handleAddPackage = () => {
    const newPackage = {
      name: packageName,
      questions: selectedQuestions,
    };
    onAdd(newPackage); // Pass the new package to the parent component
    onClose(); // Close the popup after adding
  };

  const handleQuestionToggle = (questionId) => {
    setSelectedQuestions(
      (prev) =>
        prev.includes(questionId)
          ? prev.filter((id) => id !== questionId) // Remove if already selected
          : [...prev, questionId] // Add if not selected
    );
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
        <h2 className="text-lg font-bold mb-4">Add Question Package</h2>

        <div className="mb-4">
          <label className="block font-medium mb-1">Package Name</label>
          <input
            type="text"
            value={packageName}
            onChange={(e) => setPackageName(e.target.value)}
            className="w-full border-gray-300 rounded-lg p-2"
            placeholder="Package Name..."
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Select Questions</label>
          <div className="max-h-40 overflow-y-auto border border-gray-300 rounded">
            {questions.map((question) => (
              <div key={question._id} className="flex items-center p-2">
                <input
                  type="checkbox"
                  checked={selectedQuestions.includes(question._id)}
                  onChange={() => handleQuestionToggle(question._id)}
                />
                <span className="ml-2">{question.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleAddPackage}
            className="bg-blue-500 text-white p-2 rounded w-2/5"
          >
            Add Package
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

export default AddPackagePopup;
