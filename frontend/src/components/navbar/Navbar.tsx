import React, { useState } from 'react';
import './Navbar.css';
import { NavbarLogo } from './NavbarLogo';
import { NavMenu } from './NavMenu';
import { NavSearch } from './NavSearch';
interface NavbarProps {
  onSearch?: (searchTerm: string) => void;
}



// Main Navbar Component
const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchTerm.trim()) {
      onSearch(searchTerm.trim());
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
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left: Logo */}
        <NavbarLogo />
        
        {/* Middle: Navigation */}
        <NavMenu isOpen={menuOpen} onSearchToggle={toggleSearch} />
        
        {/* Right: Search */}
        <NavSearch 
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
          isOpen={searchOpen}
        />
        
        {/* Mobile menu toggle */}
        <button 
          className="mobile-menu-toggle" 
          onClick={toggleMenu} 
          aria-label="Toggle menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 