import React from 'react';
import { Link, SortOption, ViewMode } from '../types';
import LinkCard from './LinkCard';
import LinkRow from './LinkRow';
import { Grid, List } from 'lucide-react';

interface LinkListProps {
  links: Link[];
  onEditLink: (link: Link) => void;
  onDeleteLink: (id: string) => void;
  onVisitLink: (id: string) => void;
  getCategoryColor: (categoryId: string) => string;
  selectedCategory: string;
  searchTerm: string;
  sortOption: SortOption;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const LinkList: React.FC<LinkListProps> = ({
  links,
  onEditLink,
  onDeleteLink,
  onVisitLink,
  getCategoryColor,
  selectedCategory,
  searchTerm,
  sortOption,
  viewMode,
  setViewMode
}) => {
  // Filter links based on selected category and search term
  const filteredLinks = links.filter(link => {
    const matchesCategory = selectedCategory === 'all' || link.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  // Sort links based on sort option
  const sortedLinks = [...filteredLinks].sort((a, b) => {
    switch (sortOption) {
      case 'newest':
        return b.createdAt - a.createdAt;
      case 'oldest':
        return a.createdAt - b.createdAt;
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      case 'most-visited':
        return b.visitCount - a.visitCount;
      default:
        return 0;
    }
  });

  if (sortedLinks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <img 
          src="https://images.unsplash.com/photo-1594322436404-5a0526db4d13?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
          alt="No links found" 
          className="w-48 h-48 object-cover rounded-lg mb-6 opacity-50"
        />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No links found</h3>
        <p className="text-gray-500 max-w-md">
          {searchTerm 
            ? "We couldn't find any links matching your search. Try different keywords or clear your search."
            : selectedCategory !== 'all'
              ? "There are no links in this category yet. Add some links or select a different category."
              : "Your link collection is empty. Start adding links to build your collection!"}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-500">
          {sortedLinks.length} {sortedLinks.length === 1 ? 'link' : 'links'} found
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-gray-200 text-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
            aria-label="Grid view"
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-gray-200 text-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
            aria-label="List view"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedLinks.map(link => (
            <LinkCard
              key={link.id}
              link={link}
              onEdit={onEditLink}
              onDelete={onDeleteLink}
              onVisit={onVisitLink}
              getCategoryColor={getCategoryColor}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col space-y-2">
          {sortedLinks.map(link => (
            <LinkRow
              key={link.id}
              link={link}
              onEdit={onEditLink}
              onDelete={onDeleteLink}
              onVisit={onVisitLink}
              getCategoryColor={getCategoryColor}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LinkList;
