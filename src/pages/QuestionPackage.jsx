import { useEffect, useState } from "react";
import Sidebar from "../components/Bar/sidebar";
import useQuestionsPackageStore from "../store/questionPackageStore";
import AddPackagePopup from "../components/Popup/addPackage";
import EditPackagePopup from "../components/Popup/editPackage";

export const QuestionPackage = () => {
  const {
    questions,
    loading,
    fetchQuestions,
    deleteQuestionPackage,
    addQuestionPackage,
  } = useQuestionsPackageStore();

  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [currentPackageId, setCurrentPackageId] = useState(null); // Track the current package being edited

  useEffect(() => {
    fetchQuestions(); // Fetch question packages when the component mounts
  }, [fetchQuestions]);

  const handleDelete = (id) => {
    deleteQuestionPackage(id);
  };

  const handleAddPackage = (newPackage) => {
    addQuestionPackage(newPackage);
    setShowAddPopup(false); // Close the popup after adding
  };

  const handleEditPackage = (id) => {
    setCurrentPackageId(id);
    setShowEditPopup(true); // Show the edit popup for the selected package
  };

  return (
    <div className="flex h-screen">
      <Sidebar />

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
              onClick={() => setShowAddPopup(true)}
            >
              +
            </button>
          </div>

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
                          onClick={() => handleEditPackage(pkg._id)} // Trigger the edit functionality
                          className="text-blue-500 hover:text-blue-700 mr-2"
                        >
                          Edit
                        </button>
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

      {showAddPopup && (
        <AddPackagePopup
          onClose={() => setShowAddPopup(false)}
          onAdd={handleAddPackage}
        />
      )}

      {showEditPopup && (
        <EditPackagePopup
          packageId={currentPackageId}
          onClose={() => setShowEditPopup(false)}
          onUpdate={() => {
            fetchQuestions(); // Güncellemeyi yaptıktan sonra soruları yeniden yükleyin
            setShowEditPopup(false); // Popup'ı kapat
          }}
        />
      )}
    </div>
  );
};

export default QuestionPackage;
