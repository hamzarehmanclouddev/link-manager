import React, { useState, useEffect } from 'react';
import { Link, Category, SortOption, ViewMode } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import { getCategories } from './utils/storage';
import { v4 as uuidv4 } from 'uuid';

// Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LinkList from './components/LinkList';
import Modal from './components/Modal';
import LinkForm from './components/LinkForm';

const App: React.FC = () => {
  // State
  const [links, setLinks] = useLocalStorage<Link[]>('linkVault_links', []);
  const [categories, setCategories] = useState<Category[]>(getCategories());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>('linkVault_viewMode', 'grid');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  
  // Calculate link counts by category
  const linkCountByCategory = links.reduce((counts: Record<string, number>, link) => {
    counts[link.category] = (counts[link.category] || 0) + 1;
    return counts;
  }, {});
  
  // Get category color by ID
  const getCategoryColor = (categoryId: string): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : '#6b7280'; // Default gray color
  };
  
  // Handle adding or updating a link
  const handleSaveLink = (link: Link) => {
    if (editingLink) {
      // Update existing link
      setLinks(links.map(l => l.id === link.id ? link : l));
    } else {
      // Add new link
      setLinks([...links, link]);
    }
    
    setIsModalOpen(false);
    setEditingLink(null);
  };
  
  // Handle deleting a link
  const handleDeleteLink = (id: string) => {
    if (confirm('Are you sure you want to delete this link?')) {
      setLinks(links.filter(link => link.id !== id));
    }
  };
  
  // Handle visiting a link
  const handleVisitLink = (id: string) => {
    setLinks(links.map(link => 
      link.id === id 
        ? { 
            ...link, 
            visitCount: link.visitCount + 1,
            lastVisited: Date.now()
          } 
        : link
    ));
  };
  
  // Open modal to add a new link
  const handleAddNewLink = () => {
    setEditingLink(null);
    setIsModalOpen(true);
  };
  
  // Open modal to edit an existing link
  const handleEditLink = (link: Link) => {
    setEditingLink(link);
    setIsModalOpen(true);
  };
  
  // Sample data for demonstration
  useEffect(() => {
    if (links.length === 0) {
      const sampleLinks: Link[] = [
        {
          id: uuidv4(),
          url: 'https://github.com',
          title: 'GitHub - Where the world builds software',
          description: 'GitHub is where over 100 million developers shape the future of software, together.',
          category: 'work',
          tags: ['development', 'code', 'git'],
          favicon: 'https://github.com/favicon.ico',
          createdAt: Date.now() - 86400000 * 5, // 5 days ago
          visitCount: 12
        },
        {
          id: uuidv4(),
          url: 'https://reactjs.org',
          title: 'React – A JavaScript library for building user interfaces',
          description: 'A JavaScript library for building user interfaces',
          category: 'education',
          tags: ['javascript', 'frontend', 'library'],
          favicon: 'https://reactjs.org/favicon.ico',
          createdAt: Date.now() - 86400000 * 2, // 2 days ago
          visitCount: 8
        },
        {
          id: uuidv4(),
          url: 'https://netflix.com',
          title: 'Netflix - Watch TV Shows Online, Watch Movies Online',
          description: 'Watch Netflix movies & TV shows online or stream right to your smart TV, game console, PC, Mac, mobile, tablet and more.',
          category: 'entertainment',
          tags: ['streaming', 'movies', 'tv'],
          favicon: 'https://netflix.com/favicon.ico',
          createdAt: Date.now() - 86400000 * 10, // 10 days ago
          visitCount: 5
        },
        {
          id: uuidv4(),
          url: 'https://tailwindcss.com',
          title: 'Tailwind CSS - Rapidly build modern websites without ever leaving your HTML',
          description: 'A utility-first CSS framework packed with classes like flex, pt-4, text-center and rotate-90 that can be composed to build any design, directly in your markup.',
          category: 'work',
          tags: ['css', 'design', 'frontend'],
          favicon: 'https://tailwindcss.com/favicon.ico',
          createdAt: Date.now() - 86400000, // 1 day ago
          visitCount: 3
        },
        {
          id: uuidv4(),
          url: 'https://nytimes.com',
          title: 'The New York Times - Breaking News, US News, World News',
          description: 'Live news, investigations, opinion, photos and video by the journalists of The New York Times from more than 150 countries around the world.',
          category: 'personal',
          tags: ['news', 'articles', 'journalism'],
          favicon: 'https://nytimes.com/favicon.ico',
          createdAt: Date.now() - 86400000 * 3, // 3 days ago
          visitCount: 2
        }
      ];
      
      setLinks(sampleLinks);
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortOption={sortOption}
        onSortChange={setSortOption}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          linkCountByCategory={linkCountByCategory}
          totalLinkCount={links.length}
          onAddNewLink={handleAddNewLink}
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <LinkList 
            links={links}
            onEditLink={handleEditLink}
            onDeleteLink={handleDeleteLink}
            onVisitLink={handleVisitLink}
            getCategoryColor={getCategoryColor}
            selectedCategory={selectedCategory}
            searchTerm={searchTerm}
            sortOption={sortOption}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
        </main>
      </div>
      
      <Modal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingLink(null);
        }}
        title={editingLink ? 'Edit Link' : 'Add New Link'}
      >
        <LinkForm 
          link={editingLink}
          categories={categories}
          onSave={handleSaveLink}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingLink(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default App;
