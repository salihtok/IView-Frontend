import { useEffect, useState } from "react";
import useQuestionsStore from "../../store/questionStore";
import { toast } from "react-toastify";

const AddPackagePopup = ({ onClose, onAdd }) => {
  const [packageName, setPackageName] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Accessing questions from the Zustand store
  const { questions, fetchQuestions } = useQuestionsStore();

  useEffect(() => {
    fetchQuestions(); // Fetch the questions when the popup opens
  }, [fetchQuestions]);

  const filteredQuestions = questions.filter((question) =>
    question.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPackage = () => {
    if (!packageName.trim()) {
      toast.error("Please enter a package name");
      return;
    }
    
    if (selectedQuestions.length === 0) {
      toast.error("Please select at least one question");
      return;
    }

    const newPackage = {
      name: packageName,
      questions: selectedQuestions,
    };
    onAdd(newPackage);
    toast.success("Package created successfully");
    onClose();
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
    <div 
      className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50 p-4"
    >
      <div 
        className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-[900px] max-h-[90vh] flex flex-col"
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Add Question Package</h2>

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
            onClick={handleAddPackage}
            disabled={!packageName.trim() || selectedQuestions.length === 0}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg w-full sm:w-auto ${
              !packageName.trim() || selectedQuestions.length === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-[#30847f] hover:bg-[#277571]'
            } text-white`}
          >
            Add Package
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPackagePopup;
