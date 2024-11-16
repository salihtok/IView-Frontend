import { useEffect, useState } from "react";
import useQuestionsStore from "../../store/questionStore";
import useQuestionsPackageStore from "../../store/questionPackageStore";
import { toast } from "react-toastify";

const EditPackagePopup = ({ packageId, onClose, onUpdate }) => {
  const { questions, fetchQuestions } = useQuestionsStore();
  const { fetchQuestionPackageById, questionPackage, updateQuestionPackage } =
    useQuestionsPackageStore();

  const [packageName, setPackageName] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchQuestions(); // Fetch available questions
    fetchQuestionPackageById(packageId); // Fetch the specific package to edit
  }, [fetchQuestions, fetchQuestionPackageById, packageId]);

  useEffect(() => {
    if (questionPackage) {
      setPackageName(questionPackage.name);
      setSelectedQuestions(questionPackage.questions.map((q) => q._id)); // Assuming questions are objects
    }
  }, [questionPackage]);

  const filteredQuestions = questions.filter((question) =>
    question.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdatePackage = async () => {
    try {
      const updatedPackage = {
        name: packageName,
        questions: selectedQuestions,
      };

      await updateQuestionPackage(packageId, updatedPackage);
      toast.success("Package updated successfully");
      onUpdate();
      onClose();
    } catch (error) {
      toast.error("Failed to update package");
    }
  };

  const handleQuestionToggle = (questionId) => {
    setSelectedQuestions(
      (prev) =>
        prev.includes(questionId)
          ? prev.filter((id) => id !== questionId) // Remove if already selected
          : [...prev, questionId] // Add if not selected
    );
  };

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50 p-4"
      onClick={handleOutsideClick}
    >
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-[900px] max-h-[90vh] flex flex-col">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Edit Question Package</h2>

        <div className="mb-4">
          <label className="block font-medium mb-2">Package Name</label>
          <input
            type="text"
            value={packageName}
            onChange={(e) => setPackageName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 sm:p-3"
            placeholder="Package Name..."
          />
        </div>

        <div className="flex flex-col flex-grow min-h-0">
          <label className="block font-medium mb-2">Select Questions</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 mb-3"
            placeholder="Search questions..."
          />
          
          <div className="flex-grow overflow-auto min-h-0 border border-gray-300 rounded-lg mb-4">
            {filteredQuestions.map((question) => (
              <div 
                key={question._id} 
                className="flex items-start p-3 hover:bg-gray-50 border-b border-gray-200 last:border-b-0"
              >
                <input
                  type="checkbox"
                  checked={selectedQuestions.includes(question._id)}
                  onChange={() => handleQuestionToggle(question._id)}
                  className="h-5 w-5 mt-1"
                />
                <span className="ml-3 text-sm sm:text-base break-words flex-1">
                  {question.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 mt-auto pt-2 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 w-full sm:w-auto"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdatePackage}
            disabled={selectedQuestions.length === 0 || !packageName.trim()}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg ${
              selectedQuestions.length === 0 || !packageName.trim()
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white w-full sm:w-auto`}
          >
            Update Package
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPackagePopup;
