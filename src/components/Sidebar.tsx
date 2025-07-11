import React from 'react';
import { Category } from '../types';
import { 
  Link, 
  Briefcase, 
  User, 
  BookOpen, 
  Film, 
  DollarSign, 
  Heart, 
  ShoppingBag, 
  Users, 
  Plane, 
  Folder,
  Plus
} from 'lucide-react';

interface SidebarProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  linkCountByCategory: Record<string, number>;
  totalLinkCount: number;
  onAddNewLink: () => void;
}

const getCategoryIcon = (categoryId: string) => {
  switch (categoryId) {
    case 'work':
      return <Briefcase size={18} />;
    case 'personal':
      return <User size={18} />;
    case 'education':
      return <BookOpen size={18} />;
    case 'entertainment':
      return <Film size={18} />;
    case 'finance':
      return <DollarSign size={18} />;
    case 'health':
      return <Heart size={18} />;
    case 'shopping':
      return <ShoppingBag size={18} />;
    case 'social':
      return <Users size={18} />;
    case 'travel':
      return <Plane size={18} />;
    default:
      return <Folder size={18} />;
  }
};

const Sidebar: React.FC<SidebarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  linkCountByCategory,
  totalLinkCount,
  onAddNewLink
}) => {
  return (
    <div className="bg-white border-r border-gray-200 w-64 flex-shrink-0 h-full overflow-y-auto">
      <div className="p-4">
        <button
          onClick={onAddNewLink}
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus size={18} className="mr-2" />
          Add New Link
        </button>
      </div>
      
      <div className="px-3 py-2">
        <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Categories
        </h3>
        <div className="mt-2 space-y-1">
          <button
            onClick={() => onSelectCategory('all')}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md ${
              selectedCategory === 'all'
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center">
              <Link size={18} className="mr-3" />
              <span>All Links</span>
            </div>
            <span className="bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
              {totalLinkCount}
            </span>
          </button>
          
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md ${
                selectedCategory === category.id
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <span className="mr-3 text-gray-500">
                  {getCategoryIcon(category.id)}
                </span>
                <span>{category.name}</span>
              </div>
              {linkCountByCategory[category.id] > 0 && (
                <span className="bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {linkCountByCategory[category.id]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
