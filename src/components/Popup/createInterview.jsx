import { useState } from "react";

const CreateInterviewPopup = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [packageSelection, setPackageSelection] = useState("");
  const [expireDate, setExpireDate] = useState("");
  const [canSkip, setCanSkip] = useState(false);
  const [showAtOnce, setShowAtOnce] = useState(false);

  const handleAddQuestion = () => {
    // Implement add question logic
  };

  const handleAddInterview = () => {
    // Implement add interview logic
    onClose(); // Close the popup after adding
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
        <button
          className="absolute top-2 right-2 text-gray-500"
          onClick={onClose}
        >
          <i className="fas fa-times"></i>
        </button>
        <h2 className="text-lg font-bold mb-4">Create Interview</h2>
        <div className="mb-4">
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border-gray-300 rounded-lg p-2"
            placeholder="Input..."
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Package</label>
          <select
            value={packageSelection}
            onChange={(e) => setPackageSelection(e.target.value)}
            className="w-full border-gray-300 rounded-lg p-2"
          >
            <option value="" disabled>
              Select Package
            </option>
            <option value="backend">Backend Question</option>
            <option value="frontend">Frontend Question</option>
          </select>
          <button
            onClick={handleAddQuestion}
            className="text-blue-500 hover:underline mt-2 inline-block"
          >
            + Add Question
          </button>
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Expire Date</label>
          <input
            type="text"
            value={expireDate}
            onChange={(e) => setExpireDate(e.target.value)}
            className="w-full border-gray-300 rounded-lg p-2"
            placeholder="DD/MM/YY"
          />
        </div>
        <div className="mb-4 flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={canSkip}
              onChange={(e) => setCanSkip(e.target.checked)}
              className="form-checkbox"
            />
            <span className="ml-2">Can Skip</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showAtOnce}
              onChange={(e) => setShowAtOnce(e.target.checked)}
              className="form-checkbox"
            />
            <span className="ml-2">Show At Once</span>
          </label>
        </div>
        <button
          onClick={handleAddInterview}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default CreateInterviewPopup;