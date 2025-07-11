import React, { useState, useEffect, useRef } from 'react';
import { Link, Search, SortAsc, X } from 'lucide-react';
import { SortOption } from '../types';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
}

const Header: React.FC<HeaderProps> = ({
  searchTerm,
  onSearchChange,
  sortOption,
  onSortChange
}) => {
  const [showSortMenu, setShowSortMenu] = useState(false);
  const sortMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
        setShowSortMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getSortLabel = (option: SortOption): string => {
    switch (option) {
      case 'newest':
        return 'Newest First';
      case 'oldest':
        return 'Oldest First';
      case 'alphabetical':
        return 'Alphabetical';
      case 'most-visited':
        return 'Most Visited';
      default:
        return 'Sort';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link size={24} className="text-indigo-600 mr-2" />
            <h1 className="text-xl font-bold text-gray-900">LinkVault</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search links..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            
            <div className="relative" ref={sortMenuRef}>
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <SortAsc size={18} className="mr-2" />
                <span>{getSortLabel(sortOption)}</span>
              </button>
              
              {showSortMenu && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {(['newest', 'oldest', 'alphabetical', 'most-visited'] as SortOption[]).map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          onSortChange(option);
                          setShowSortMenu(false);
                        }}
                        className={`block px-4 py-2 text-sm w-full text-left ${
                          sortOption === option
                            ? 'bg-gray-100 text-gray-900 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {getSortLabel(option)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
