import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import './HomePage.css';

// Icon component for Contact Us button
const ContactIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V8L12 13L20 8V18ZM12 11L4 6H20L12 11Z" fill="currentColor"/>
  </svg>
);

// Search icon component
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="currentColor"/>
  </svg>
);

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
      <div className="hero-section">
        <div className="hero-content">
          <h1>Your Gateway to Knowledge</h1>
          <p className="hero-subtitle">Discover millions of books, articles, and resources at your fingertips</p>
          
          <div className="search-container">
            <form onSubmit={handleSearchSubmit} className="search-form">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="Search articles, books, journals, media and more"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="search-input"
                  aria-label="Search library resources"
                />
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="search-button"
                  icon={<SearchIcon />}
                  iconPosition="left"
                  aria-label="Search library resources"
                >
                  Search
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <div className="features-section">
        <h2 className="section-title">Quick Links</h2>
        <div className="quick-links">
          <div className="quick-link-card" onClick={() => navigateToSection('/books')}>
            <div className="quick-link-icon">📚</div>
            <h3>All Books</h3>
            <p>Browse our extensive collection of books</p>
          </div>
          
          <div className="quick-link-card" onClick={() => navigateToSection('/research-guides')}>
            <div className="quick-link-icon">📑</div>
            <h3>Research Guides</h3>
            <p>Expert guides to help with your research</p>
          </div>
          
          <div className="quick-link-card" onClick={() => navigateToSection('/interlibrary')}>
            <div className="quick-link-icon">🌎</div>
            <h3>Interlibrary Loans</h3>
            <p>Get resources from other libraries worldwide</p>
          </div>
        </div>
        
        <div className="info-banner">
          <div className="info-icon">ℹ️</div>
          <div className="info-content">
            <h3>Need Help?</h3>
            <p>Our librarians are available to assist you with your research needs.</p>
          </div>
          <Button 
            variant="primary" 
            size="md" 
            onClick={() => navigateToSection('/contact')} 
            icon={<ContactIcon />}
            iconPosition="right"
            rounded
          >
            Contact Us
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 