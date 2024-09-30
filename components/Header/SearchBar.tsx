"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa'; 
import { useRouter } from 'next/navigation';

let hasInit = false;

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const router = useRouter();

  const handleSearch = useCallback((e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    const isTextSearch = !!e;
    if (!searchQuery.trim() && isTextSearch) {
      alert("Please provide search input or select a filter.");
      return;
    }

    const queryParam = encodeURIComponent(searchQuery.trim());
    const filterParam = encodeURIComponent(selectedFilter);
    router.push(`/search?query=${queryParam}&filter=${filterParam}`);
  }, [router, searchQuery, selectedFilter]);

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    setFiltersOpen(false);
  };

  useEffect(() => {
    if (hasInit && searchQuery.trim()) {
      handleSearch();
    } else {
      hasInit = true;
    }
  }, [handleSearch, selectedFilter, searchQuery]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center border-b-2 border-black pt-16 pb-4 mx-6 md:pb-2">
      <div className="relative flex-grow">
        <input
          type="text"
          className="w-full text-2xl p-2 focus:outline-none"
          placeholder="Search by keyword, artist or artwork"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {searchQuery && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black focus:outline-none"
          >
            <FaTimes size={20} />
          </button>
        )}
      </div>
      <div className="relative ml-4 flex items-center">
        <button
          type="button"
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="text-black hover:text-gray-600 focus:outline-none mr-6"
        >
          <FaFilter size={24} />
        </button>

        <button
          type="submit"
          className="text-black hover:text-gray-600 focus:outline-none mr-4"
        >
          <FaSearch size={24} />
        </button>

        {filtersOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-lg">
            <ul>
              <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleFilterChange('All')}>All</li>
              <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleFilterChange('Painting')}>Painting</li>
              <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleFilterChange('Sculpture')}>Sculpture</li>
              <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleFilterChange('Print')}>Print</li>
              <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleFilterChange('Book')}>Book</li>
              <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleFilterChange('Photograph')}>Photograph</li>
              <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleFilterChange('Textile')}>Textile</li>
              <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleFilterChange('Vessel')}>Vessel</li>
            </ul>
          </div>
        )}
      </div>
    </form>
  );
}
