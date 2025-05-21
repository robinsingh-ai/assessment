import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const navigateToSection = (path: string) => {
    navigate(path);
  };

  return (
    <div className="home-container">
      <div className="search-primo-container">
        <h1>Search Primo</h1>
        
        <div className="search-container">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <input
              type="text"
              placeholder="Search articles, books, journals, media and more"
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
              aria-label="Search library resources"
            />
            <button type="submit" className="search-button-home">Search</button>
          </form>
        </div>
      </div>
      
      <div className="quick-links-container">
        <div className="quick-links">
          <button 
            className="quick-link-button"
            onClick={() => navigateToSection('/books')}
          >
            <span className="icon">📚</span>
            <span>All Books</span>
          </button>
          
          
          <button 
            className="quick-link-button"
            onClick={() => navigateToSection('/research-guides')}
          >
            <span className="icon">📑</span>
            <span>Research Guides</span>
          </button>
          
          <button 
            className="quick-link-button"
            onClick={() => navigateToSection('/interlibrary')}
          >
            <span className="icon">🌎</span>
            <span>Get Items from Other Libraries</span>
          </button>
        </div>
        
        
      </div>
    </div>
  );
};

export default HomePage; 