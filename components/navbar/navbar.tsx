import React, { useState } from "react";

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
    <nav className="fixed w-full flex items-center justify-between bg-gray-100 px-6 py-3 border-b shadow-sm z-50">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-800">Repo Reader</h1>
      </div>

      <div className="flex-1 mx-8">
        <input
          type="text"
          placeholder="Search nodes..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300 text-sm"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className="flex items-center">
        <button 
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
          onClick={onDownload}>
          <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg>
          <span>Download</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;