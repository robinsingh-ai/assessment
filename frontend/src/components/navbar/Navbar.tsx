import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { NavbarLogo } from './NavbarLogo';
import { NavMenu } from './NavMenu';
import { NavSearch } from './NavSearch';
import Button from '../common/Button';

interface NavbarProps {
  onSearch?: (searchTerm: string) => void;
}

// Menu icon SVG component
const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z" fill="currentColor"/>
  </svg>
);

// Close icon SVG component
const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
  </svg>
);

// Search icon SVG component
const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="currentColor"/>
  </svg>
);

// Main Navbar Component
const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchTerm.trim()) {
      onSearch(searchTerm.trim());
      setSearchOpen(false);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (searchOpen && !menuOpen) {
      setSearchOpen(false);
    }
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (menuOpen && !searchOpen) {
      setMenuOpen(false);
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Left: Logo */}
        <NavbarLogo />
        
        {/* Middle: Navigation */}
        <NavMenu isOpen={menuOpen} onSearchToggle={toggleSearch} />
        
        {/* Right: Search */}
        <div className="navbar-actions">
          <NavSearch 
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            onSearchSubmit={handleSearchSubmit}
            isOpen={searchOpen}
          />
          
          <Button 
            variant="text" 
            className="navbar-search-toggle" 
            onClick={toggleSearch}
            icon={<SearchIcon />}
            iconPosition="left"
            ariaLabel="Toggle search"
          >
            Search
          </Button>
        </div>
        
        {/* Mobile menu toggle */}
        <Button 
          variant="text" 
          className="mobile-menu-toggle" 
          onClick={toggleMenu} 
          ariaLabel="Toggle menu"
          icon={menuOpen ? <CloseIcon /> : <MenuIcon />}
          iconPosition="left"
        >
          {menuOpen ? 'Close' : 'Menu'}
        </Button>
      </div>
    </nav>
  );
};

export default Navbar; 