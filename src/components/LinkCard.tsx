import React from 'react';
import { Link as LinkType } from '../types';
import { Link2, Clock, ExternalLink, Edit, Trash2, Tag } from 'lucide-react';
import { extractDomain } from '../utils/storage';

interface LinkCardProps {
  link: LinkType;
  onEdit: (link: LinkType) => void;
  onDelete: (id: string) => void;
  onVisit: (id: string) => void;
  getCategoryColor: (categoryId: string) => string;
}

const LinkCard: React.FC<LinkCardProps> = ({ 
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
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col h-full border border-gray-200"
      onClick={() => onEdit(link)}
    >
      <div 
        className="h-2" 
        style={{ backgroundColor: categoryColor }}
      ></div>
      
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center">
            {link.favicon ? (
              <img 
                src={link.favicon} 
                alt="Favicon" 
                className="w-6 h-6 mr-2"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).nextElementSibling!.style.display = 'block';
                }}
              />
            ) : null}
            <div 
              className="w-6 h-6 mr-2 bg-gray-200 rounded-full flex items-center justify-center"
              style={{ display: link.favicon ? 'none' : 'flex' }}
            >
              <Link2 size={14} className="text-gray-500" />
            </div>
            <span className="text-xs text-gray-500">{domain}</span>
          </div>
          <div className="flex space-x-1">
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
        
        <h3 className="font-semibold text-lg mb-1 line-clamp-2">{link.title}</h3>
        
        {link.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{link.description}</p>
        )}
        
        <div className="mt-auto">
          {link.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {link.tags.slice(0, 3).map((tag, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                >
                  <Tag size={10} className="mr-1" />
                  {tag}
                </span>
              ))}
              {link.tags.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                  +{link.tags.length - 3}
                </span>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <Clock size={12} className="mr-1" />
              <span>{formattedDate}</span>
            </div>
            {link.visitCount > 0 && (
              <span className="bg-gray-100 px-2 py-1 rounded-full">
                {link.visitCount} {link.visitCount === 1 ? 'visit' : 'visits'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkCard;
