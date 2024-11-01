import { useEffect, useState } from "react";
import Sidebar from "../components/Bar/sidebar";
import useQuestionsPackageStore from "../store/questionPackageStore";
import AddPackagePopup from "../components/Popup/addPackage";
import EditPackagePopup from "../components/Popup/editPackage";
import SearchBar from "../components/Bar/SearchBar";
import AddButton from "../components/Buttons/AddButton";
import EditButton from "../components/Buttons/EditButton";
import DeleteButton from "../components/Buttons/DeleteButton";
import LogoutButton from "../components/Buttons/LogoutButton";

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
  const [currentPackageId, setCurrentPackageId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchQuestions();
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

  const filteredQuestions = questions.filter((pkg) =>
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-grow p-6 bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold mb-6">Package List</h2>
            <div className="flex items-center gap-4">
              <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                placeholder="Search packages..."
              />
              <AddButton
                onClick={() => setShowAddPopup(true)}
                id="addQuestionPackageBtn"
              />
              <LogoutButton />
            </div>
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
                    <th className="py-3 px-4">Question Count</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody id="questionList">
                  {filteredQuestions.map((pkg, index) => (
                    <tr key={pkg._id} className="border-t">
                      <td className="py-2 px-4">{index + 1}</td>
                      <td className="py-2 px-4">{pkg.name}</td>
                      <td className="py-2 px-4">{pkg.questions.length}</td>
                        <td className="py-3 px-4 flex items-center gap-2">
                          <EditButton
                            onClick={() => handleEditPackage(pkg._id)} />{" "}
                          <DeleteButton onClick={() => handleDelete(pkg._id)} />{" "}
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
