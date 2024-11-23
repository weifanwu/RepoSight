import React, { useState } from "react";
import { FiDownload } from "react-icons/fi";

interface NavbarProps {
  onSearch: (query: string) => void;
  onDownload: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch, onDownload }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <nav className="flex items-center justify-between bg-gray-100 px-6 py-3 border-b shadow-sm">
      {/* Left Section: Title */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-800">Repo Reader</h1>
      </div>

      {/* Center Section: Search */}
      <div className="flex-1 mx-8">
        <input
          type="text"
          placeholder="Search nodes..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300 text-sm"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* Right Section: Download Button */}
      <div className="flex items-center">
        <button
          onClick={onDownload}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:ring focus:ring-blue-300"
        >
          <FiDownload className="mr-2" />
          Download
        </button>
      </div>
    </nav>
  );
};

export default Navbar;