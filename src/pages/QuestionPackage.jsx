import { useEffect, useState } from "react";
import Sidebar from "../components/Bar/sidebar";
import useQuestionsPackageStore from "../store/questionPackageStore";
import AddPackagePopup from "../components/Popup/addPackage";

export const QuestionPackage = () => {
  const {
    questions,
    loading,
    fetchQuestions,
    deleteQuestionPackage,
    addQuestionPackage,
  } = useQuestionsPackageStore();

  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Fetch question packages when the component mounts
    fetchQuestions();
  }, [fetchQuestions]);

  const handleDelete = (id) => {
    deleteQuestionPackage(id);
  };

  const handleAddPackage = (newPackage) => {
    addQuestionPackage(newPackage);
    setShowPopup(false); // Close the popup after adding
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-grow p-6 bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              id="packageTitle"
              placeholder="Search Packages..."
              className="p-2 border border-gray-300 rounded w-1/2"
            />
            <button
              id="addQuestionPackageBtn"
              className="bg-gray-500 text-white p-2 rounded"
              onClick={() => setShowPopup(true)}
            >
              +
            </button>
          </div>

          {/* Question List */}
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="overflow-hidden border border-gray-300 rounded">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="w-full bg-gray-200 text-left text-gray-600">
                    <th className="py-3 px-4">Order</th>
                    <th className="py-3 px-4">Package Name</th>
                    <th className="py-3 px-4">Questions</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody id="questionList">
                  {questions.map((pkg, index) => (
                    <tr key={pkg._id} className="border-t">
                      <td className="py-2 px-4">{index + 1}</td>
                      <td className="py-2 px-4">{pkg.name}</td>
                      <td className="py-2 px-4">{pkg.questions.length}</td>
                      <td className="py-2 px-4">
                        <button
                          onClick={() => handleDelete(pkg._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Question Package Popup */}
      {showPopup && (
        <AddPackagePopup
          onClose={() => setShowPopup(false)}
          onAdd={handleAddPackage}
        />
      )}
    </div>
  );
};

export default QuestionPackage;