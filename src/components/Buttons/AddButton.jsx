// src/components/AddButton.js
import React from "react";

const AddButton = ({ onClick, id }) => {
  return (
    <button
      id={id}
      className="ml-2 px-1 py-1 text-gray-400 hover:text-gray-700 rounded"
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className="size-6"
      >
        <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
      </svg>
    </button>
  );
};

export default AddButton;