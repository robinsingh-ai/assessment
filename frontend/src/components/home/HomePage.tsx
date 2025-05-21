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
                <button type="submit" className="search-button-home">
                  <span className="search-icon">🔍</span>
                  <span>Search</span>
                </button>
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
          <button className="contact-button" onClick={() => navigateToSection('/contact')}>Contact Us</button>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 