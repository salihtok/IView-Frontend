import { useState } from "react";
import PropTypes from "prop-types";

const AddPackagePopup = ({ onClose, onAdd }) => {
  const [packageName, setPackageName] = useState("");

  const handleAddPackage = () => {
    const newPackage = {
      name: packageName,
      questions: [], // Initially, no questions are added to the package
    };
    onAdd(newPackage); // Pass the new package to the parent component
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
        <h2 className="text-lg font-bold mb-4">Add Question Package</h2>
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
        <button
          onClick={handleAddPackage}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Add Package
        </button>
      </div>
    </div>
  );
};

// Define prop types for props validation
AddPackagePopup.propTypes = {
  onClose: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default AddPackagePopup;