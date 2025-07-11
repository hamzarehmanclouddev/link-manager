import React, { useState, useEffect } from 'react';
import { Link, Category } from '../types';
import { X, Plus, Link2 } from 'lucide-react';
import { isValidUrl, extractFavicon } from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';

interface LinkFormProps {
  link: Link | null;
  categories: Category[];
  onSave: (link: Link) => void;
  onCancel: () => void;
}

const emptyLink: Link = {
  id: '',
  url: '',
  title: '',
  description: '',
  category: 'other',
  tags: [],
  favicon: '',
  createdAt: Date.now(),
  visitCount: 0
};

const LinkForm: React.FC<LinkFormProps> = ({ link, categories, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Link>(link || { ...emptyLink, id: uuidv4() });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState(!!link);

  useEffect(() => {
    setFormData(link || { ...emptyLink, id: uuidv4() });
    setIsEditing(!!link);
  }, [link]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleUrlBlur = async () => {
    const { url } = formData;
    
    if (!url) return;
    
    if (!isValidUrl(url)) {
      setErrors(prev => ({ ...prev, url: 'Please enter a valid URL' }));
      return;
    }
    
    // If title is empty, try to fetch it from the URL
    if (!formData.title) {
      try {
        // Note: This would normally be a server-side operation
        // For this client-side demo, we'll just set a placeholder
        setFormData(prev => ({
          ...prev,
          title: `Page from ${new URL(url).hostname}`,
          favicon: extractFavicon(url)
        }));
      } catch (error) {
        console.error('Error fetching page title:', error);
      }
    }
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    
    // Check if tag already exists
    if (formData.tags.includes(tagInput.trim())) {
      setTagInput('');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, tagInput.trim()]
    }));
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput) {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!formData.url) {
      newErrors.url = 'URL is required';
    } else if (!isValidUrl(formData.url)) {
      newErrors.url = 'Please enter a valid URL';
    }
    
    if (!formData.title) {
      newErrors.title = 'Title is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // If creating a new link, set creation time
    const linkToSave = {
      ...formData,
      createdAt: isEditing ? formData.createdAt : Date.now(),
      favicon: formData.favicon || extractFavicon(formData.url)
    };
    
    onSave(linkToSave);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
          URL
        </label>
        <input
          type="text"
          id="url"
          name="url"
          value={formData.url}
          onChange={handleChange}
          onBlur={handleUrlBlur}
          placeholder="https://example.com"
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
            errors.url ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.url && <p className="mt-1 text-sm text-red-500">{errors.url}</p>}
      </div>
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Page Title"
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description (optional)
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Brief description of the link"
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
          Tags
        </label>
        <div className="flex">
          <input
            type="text"
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a tag"
            className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-3 py-2 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <Plus size={16} />
          </button>
        </div>
        
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1.5 text-indigo-500 hover:text-indigo-700 focus:outline-none"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {isEditing ? 'Update Link' : 'Save Link'}
        </button>
      </div>
    </form>
  );
};

export default LinkForm;
