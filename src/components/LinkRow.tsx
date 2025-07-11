import React from 'react';
import { Link as LinkType } from '../types';
import { Link2, Clock, ExternalLink, Trash2, Tag } from 'lucide-react';
import { extractDomain } from '../utils/storage';

interface LinkRowProps {
  link: LinkType;
  onEdit: (link: LinkType) => void;
  onDelete: (id: string) => void;
  onVisit: (id: string) => void;
  getCategoryColor: (categoryId: string) => string;
}

const LinkRow: React.FC<LinkRowProps> = ({ 
  link, 
  onEdit, 
  onDelete, 
  onVisit,
  getCategoryColor
}) => {
  const handleVisit = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(link.url, '_blank');
    onVisit(link.id);
  };

  const domain = extractDomain(link.url);
  const categoryColor = getCategoryColor(link.category);
  
  const formattedDate = new Date(link.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div 
      className="bg-white rounded-lg shadow-sm hover:shadow transition-shadow duration-300 border border-gray-200 p-4 flex items-center"
      onClick={() => onEdit(link)}
    >
      <div 
        className="w-1 h-16 rounded-full mr-4 flex-shrink-0" 
        style={{ backgroundColor: categoryColor }}
      ></div>
      
      <div className="flex-grow min-w-0">
        <div className="flex items-center mb-1">
          {link.favicon ? (
            <img 
              src={link.favicon} 
              alt="Favicon" 
              className="w-4 h-4 mr-2"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).nextElementSibling!.style.display = 'block';
              }}
            />
          ) : null}
          <div 
            className="w-4 h-4 mr-2 bg-gray-200 rounded-full flex items-center justify-center"
            style={{ display: link.favicon ? 'none' : 'flex' }}
          >
            <Link2 size={10} className="text-gray-500" />
          </div>
          <span className="text-xs text-gray-500 truncate">{domain}</span>
        </div>
        
        <h3 className="font-semibold text-base truncate">{link.title}</h3>
        
        {link.description && (
          <p className="text-gray-600 text-sm truncate">{link.description}</p>
        )}
      </div>
      
      <div className="flex items-center ml-4 space-x-3">
        {link.tags.length > 0 && (
          <div className="hidden md:flex flex-wrap gap-1">
            {link.tags.slice(0, 2).map((tag, index) => (
              <span 
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
              >
                <Tag size={10} className="mr-1" />
                {tag}
              </span>
            ))}
            {link.tags.length > 2 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                +{link.tags.length - 2}
              </span>
            )}
          </div>
        )}
        
        <div className="hidden sm:flex items-center text-xs text-gray-500">
          <Clock size={12} className="mr-1" />
          <span>{formattedDate}</span>
        </div>
        
        {link.visitCount > 0 && (
          <span className="hidden lg:inline-block bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-700">
            {link.visitCount} {link.visitCount === 1 ? 'visit' : 'visits'}
          </span>
        )}
        
        <div className="flex space-x-1 ml-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(link.id);
            }}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Delete link"
          >
            <Trash2 size={16} />
          </button>
          <button 
            onClick={handleVisit}
            className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
            aria-label="Open link"
          >
            <ExternalLink size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkRow;
