import { useState, useEffect } from "react";
import useInterviewStore from "../../store/interviewStore";
import useQuestionsPackageStore from "../../store/questionPackageStore";

const InterviewPopup = ({ onClose }) => {
  const { createInterview } = useInterviewStore();
  const {
    questions,
    fetchQuestions,
    loading: questionsLoading,
  } = useQuestionsPackageStore();

  const [newInterview, setNewInterview] = useState({
    title: "",
    questionPackages: [], // Çoklu paket için array
    expireDate: "",
  });

  useEffect(() => {
    fetchQuestions(); // Tüm soru paketlerini yükle
  }, []);

  const handleCreateInterview = () => {
    createInterview(
      newInterview.title,
      newInterview.questionPackages,
      newInterview.expireDate
    );
    onClose(); // Popup'ı kapat
  };

  const handleQuestionPackageChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );

    // Seçilen yeni paketleri ekleyip, yinelenenleri kaldırma
    setNewInterview({
      ...newInterview,
      questionPackages: [
        ...new Set([...newInterview.questionPackages, ...selectedOptions]),
      ],
    });
  };

  const removeQuestionPackage = (pkgId) => {
    // Seçilen paketi listeden kaldırma
    setNewInterview({
      ...newInterview,
      questionPackages: newInterview.questionPackages.filter(
        (id) => id !== pkgId
      ),
    });
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-[600px] h-[80vh] flex flex-col">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Add New Interview</h2>

        <div className="flex-1 overflow-y-auto pr-2">
          <div className="mb-6">
            <label className="block font-medium mb-2">Interview Title</label>
            <input
              type="text"
              placeholder="Interview Title"
              value={newInterview.title}
              onChange={(e) =>
                setNewInterview({ ...newInterview, title: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg p-2 sm:p-3"
            />
          </div>

          <div className="mb-6">
            <label className="block font-medium mb-2">Question Packages</label>
            <select
              multiple
              onChange={handleQuestionPackageChange}
              className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 min-h-[120px]"
            >
              <option disabled>Select Question Packages</option>
              {questionsLoading ? (
                <option>Loading...</option>
              ) : (
                questions.map((pkg) => (
                  <option key={pkg._id} value={pkg._id}>
                    {pkg.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="mb-6">
            <h4 className="font-medium mb-2">Selected Packages:</h4>
            {newInterview.questionPackages.length > 0 ? (
              <ul className="space-y-2">
                {newInterview.questionPackages.map((pkgId) => {
                  const pkg = questions.find((q) => q._id === pkgId);
                  return (
                    <li key={pkgId} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                      {pkg?.name}
                      <button
                        onClick={() => removeQuestionPackage(pkgId)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-gray-500">No packages selected.</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block font-medium mb-2">Expire Date</label>
            <input
              type="date"
              value={newInterview.expireDate}
              onChange={(e) =>
                setNewInterview({
                  ...newInterview,
                  expireDate: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded-lg p-2 sm:p-3"
            />
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
            onClick={handleCreateInterview}
            disabled={!newInterview.title || newInterview.questionPackages.length === 0 || !newInterview.expireDate}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg w-full sm:w-auto ${
              !newInterview.title || newInterview.questionPackages.length === 0 || !newInterview.expireDate
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-[#30847f] hover:bg-[#277571] text-white'
            }`}
          >
            Add Interview
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewPopup;