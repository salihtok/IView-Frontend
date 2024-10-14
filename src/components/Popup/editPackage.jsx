import { useEffect, useState } from "react";
import useQuestionsStore from "../../store/questionStore";
import useQuestionsPackageStore from "../../store/questionPackageStore";

const EditPackagePopup = ({ packageId, onClose, onUpdate }) => {
  const { questions, fetchQuestions } = useQuestionsStore();
  const { fetchQuestionPackageById, questionPackage, updateQuestionPackage } =
    useQuestionsPackageStore();

  const [packageName, setPackageName] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState([]);

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

  const handleUpdatePackage = async () => {
    const updatedPackage = {
      name: packageName,
      questions: selectedQuestions,
    };

    // Güncelleme yapıldıktan sonra store'dan yeni veriyi çekin
    await updateQuestionPackage(packageId, updatedPackage);
    onUpdate(); // Bu fonksiyon güncellemeyi alır
    onClose(); // Popup'ı kapat
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
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✖
        </button>
        <h2 className="text-lg font-bold mb-4">Edit Question Package</h2>

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

        <button
          onClick={handleUpdatePackage}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Update Package
        </button>
      </div>
    </div>
  );
};

export default EditPackagePopup;