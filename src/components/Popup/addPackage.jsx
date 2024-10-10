import { useState } from "react";

const AddPackagePopup = ({ onClose }) => {
  const [question, setQuestion] = useState("");
  const [duration, setDuration] = useState(2); // Default to 2 minutes

  const handleAddQuestion = () => {
    // Implement add question logic
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
        <h2 className="text-lg font-bold mb-4">Add Question</h2>
        <div className="mb-4">
          <label className="block font-medium mb-1">Question</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full border-gray-300 rounded-lg p-2"
            placeholder="Input..."
            rows="3"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Duration (min)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full border-gray-300 rounded-lg p-2"
            min="1"
            placeholder="2"
          />
        </div>
        <button
          onClick={handleAddQuestion}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default AddPackagePopup;