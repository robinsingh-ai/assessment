import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

interface NavbarProps {
  onSearch?: (searchTerm: string) => void;
}

// Logo Component
const NavbarLogo: React.FC = () => {
  return (
    <div className="navbar-logo">
      <Link to="/">
        <h1>Library Management</h1>
      </Link>
    </div>
  );
};

// Navigation Menu Item Component
interface NavMenuItemProps {
  title: string;
  links: { to: string; text: string }[];
}

const NavMenuItem: React.FC<NavMenuItemProps> = ({ title, links }) => {
  return (
    <div className="navbar-item dropdown">
      <span className="dropdown-toggle">{title}</span>
      <div className="dropdown-content">
        {links.map((link, index) => (
          <Link key={index} to={link.to}>{link.text}</Link>
        ))}
      </div>
    </div>
  );
};

// Navigation Menu Component
const NavMenu: React.FC<{ isOpen: boolean; onSearchToggle: () => void }> = ({ isOpen, onSearchToggle }) => {
  return (
    <div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
      <NavMenuItem 
        title="Find, Borrow, Request"
        links={[
          { to: "/books", text: "Browse Books" },
          { to: "/new-arrivals", text: "New Arrivals" },
          { to: "/popular", text: "Popular Titles" }
        ]}
      />
      
      <NavMenuItem 
        title="Research & Instruction"
        links={[
          { to: "/research-guides", text: "Research Guides" },
          { to: "/tutorials", text: "Tutorials" },
          { to: "/workshops", text: "Workshops" }
        ]}
      />
      
      <NavMenuItem 
        title="Library Spaces"
        links={[
          { to: "/study-rooms", text: "Study Rooms" },
          { to: "/computer-labs", text: "Computer Labs" },
          { to: "/meeting-spaces", text: "Meeting Spaces" }
        ]}
      />
      
      <NavMenuItem 
        title="About"
        links={[
          { to: "/about", text: "About Us" },
          { to: "/contact", text: "Contact" },
          { to: "/hours", text: "Hours & Location" }
        ]}
      />
      
      {/* Mobile-only search toggle */}
      <div className="navbar-item mobile-search-toggle" onClick={onSearchToggle}>
        <span className="dropdown-toggle">Search</span>
      </div>
    </div>
  );
};

// Search Component
interface SearchProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  isOpen: boolean;
}

const NavbarSearch: React.FC<SearchProps> = ({ searchTerm, onSearchChange, onSearchSubmit, isOpen }) => {
  return (
    <div className={`navbar-search ${isOpen ? 'active' : ''}`}>
      <form onSubmit={onSearchSubmit}>
        <input
          type="text"
          placeholder="Search books..."
          value={searchTerm}
          onChange={onSearchChange}
          className="search-input"
          aria-label="Search books"
        />
        <button type="submit" className="search-button" aria-label="Submit search">
          🔍
        </button>
      </form>
    </div>
  );
};

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
        <NavbarSearch 
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