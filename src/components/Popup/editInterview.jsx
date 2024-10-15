import React, { useEffect, useState } from "react";
import useInterviewStore from "../../store/interviewStore";
import useQuestionsPackageStore from "../../store/questionPackageStore";

const EditInterviewPopup = ({ interviewId, onClose }) => {
  const { interview, fetchInterviewById, updateInterview, loading, error } =
    useInterviewStore();
  const { questions, fetchQuestions, questionsLoading } =
    useQuestionsPackageStore();
  const [title, setTitle] = useState("");
  const [selectedPackages, setSelectedPackages] = useState(new Set()); // Use Set to manage selected packages
  const [expireDate, setExpireDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      await fetchInterviewById(interviewId); // Fetch the interview details by ID
      await fetchQuestions(); // Fetch the question packages
    };
    fetchData();
  }, [interviewId, fetchInterviewById, fetchQuestions]);

  useEffect(() => {
    if (interview) {
      setTitle(interview.title);
      setSelectedPackages(
        new Set(interview.questionPackage.map((pkg) => pkg._id))
      ); // Set selected question packages
      const formattedDate = new Date(interview.expireDate)
        .toISOString()
        .slice(0, 16); // Format expire date
      setExpireDate(formattedDate);
    }
  }, [interview]);

  const handleUpdate = async () => {
    const updateData = {
      title,
      questionPackage: Array.from(selectedPackages),
      expireDate,
    }; // Convert Set to Array
    await updateInterview(interviewId, updateData); // Update interview data
    onClose(); // Close the popup after update
  };

  const togglePackageSelection = (pkgId) => {
    const newSelectedPackages = new Set(selectedPackages);
    if (newSelectedPackages.has(pkgId)) {
      newSelectedPackages.delete(pkgId); // Remove package if already selected
    } else {
      newSelectedPackages.add(pkgId); // Add package if not selected
    }
    setSelectedPackages(newSelectedPackages); // Update the state with new selected packages
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h3 className="text-xl font-bold mb-4">Edit Interview</h3>

        <input
          type="text"
          placeholder="Interview Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 mb-2 w-full"
        />

        <div className="mb-2">
          <label className="font-bold mb-2 block">
            Select Question Packages:
          </label>
          {questionsLoading ? (
            <div>Loading...</div>
          ) : (
            questions.map((pkg) => (
              <div key={pkg._id} className="flex items-center">
                <input
                  type="checkbox"
                  value={pkg._id}
                  checked={selectedPackages.has(pkg._id)} // Check if package is selected
                  onChange={() => togglePackageSelection(pkg._id)} // Handle selection toggle
                />
                <label className="ml-2">{pkg.name}</label>
              </div>
            ))
          )}
        </div>

        <div className="mb-4">
          <h4 className="font-bold">Selected Packages:</h4>
          {selectedPackages.size > 0 ? (
            <ul className="list-disc pl-5">
              {Array.from(selectedPackages).map((pkgId) => {
                const pkg = questions.find((q) => q._id === pkgId);
                return (
                  <li key={pkgId} className="flex justify-between items-center">
                    {pkg?.name}
                    <button
                      onClick={() => togglePackageSelection(pkgId)}
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
          type="datetime-local"
          value={expireDate}
          onChange={(e) => setExpireDate(e.target.value)}
          className="border p-2 mb-4 w-full"
        />

        <div className="flex justify-between">
          <button
            onClick={handleUpdate}
            className="bg-blue-500 text-white p-2 rounded w-2/5"
          >
            Update Interview
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

export default EditInterviewPopup;