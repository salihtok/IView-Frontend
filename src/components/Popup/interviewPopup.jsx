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
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h3 className="text-xl font-bold mb-4">Add New Interview</h3>

        <input
          type="text"
          placeholder="Interview Title"
          value={newInterview.title}
          onChange={(e) =>
            setNewInterview({ ...newInterview, title: e.target.value })
          }
          className="border p-2 mb-2 w-full"
        />

        <select
          multiple
          onChange={handleQuestionPackageChange}
          className="border p-2 mb-2 w-full"
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

        <div className="mb-4">
          <h4 className="font-bold">Selected Packages:</h4>
          {newInterview.questionPackages.length > 0 ? (
            <ul className="list-disc pl-5">
              {newInterview.questionPackages.map((pkgId) => {
                const pkg = questions.find((q) => q._id === pkgId);
                return (
                  <li key={pkgId} className="flex justify-between items-center">
                    {pkg?.name}
                    <button
                      onClick={() => removeQuestionPackage(pkgId)}
                      className="text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>No packages selected.</p>
          )}
        </div>

        <input
          type="date"
          value={newInterview.expireDate}
          onChange={(e) =>
            setNewInterview({
              ...newInterview,
              expireDate: e.target.value,
            })
          }
          className="border p-2 mb-4 w-full"
        />

        <div className="flex justify-between">
          <button
            onClick={handleCreateInterview}
            className="bg-blue-500 text-white p-2 rounded w-2/5"
          >
            Add Interview
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

export default InterviewPopup;