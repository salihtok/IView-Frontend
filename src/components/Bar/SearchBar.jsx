import React, { useState } from "react";

const SearchBar = ({ placeholder, onSearch, className }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value); // This will trigger search on each keystroke
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <input
        type="text"
        value={searchTerm}
        placeholder={placeholder || "Search..."}
        onChange={handleChange}
        className="w-full px-4 py-2 text-gray-700 bg-white border rounded-lg focus:outline-none focus:border-blue-500"
      />
      <button
        type="submit"
        className="absolute inset-y-0 right-0 flex items-center pr-3"
      >
        <svg
          className="w-5 h-5 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </form>
  );
};

export default SearchBar;
