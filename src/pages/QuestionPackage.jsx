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
    <div className="flex">
      <div className="fixed h-screen">
        <Sidebar />
      </div>

      <div className="flex-1 ml-[240px]">
        <div className="p-6 bg-white">
          <div className="bg-[rgb(240,250,249)] shadow-lg rounded-lg p-6">
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
              <div className="overflow-hidden border border-gray-300 rounded bg-white shadow-md">
                <table className="min-w-full">
                  <thead>
                    <tr className="w-full bg-white-200 text-left text-gray-600">
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
      </div>

      {showAddPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div 
            className="bg-white rounded-lg shadow-xl w-[98%] max-w-[1400px] max-h-[98vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <AddPackagePopup
              onClose={() => setShowAddPopup(false)}
              onAdd={handleAddPackage}
            />
          </div>
        </div>
      )}

      {showEditPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div 
            className="bg-white rounded-lg shadow-xl w-[98%] max-w-[1400px] max-h-[98vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <EditPackagePopup
              packageId={currentPackageId}
              onClose={() => setShowEditPopup(false)}
              onUpdate={() => {
                fetchQuestions();
                setShowEditPopup(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionPackage;
