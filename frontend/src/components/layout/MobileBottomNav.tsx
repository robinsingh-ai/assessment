import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './MobileBottomNav.css';

// Icons for navigation
const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z" fill="currentColor"/>
  </svg>
);

const BooksIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <path d="M18 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V4C20 2.9 19.1 2 18 2ZM9 4H11V9L10 8.25L9 9V4ZM18 20H6V4H7V13L10 10.75L13 13V4H18V20Z" fill="currentColor"/>
  </svg>
);

const AddIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="currentColor"/>
  </svg>
);

const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  
  // Don't show on edit pages
  if (location.pathname.includes('/edit/')) {
    return null;
  }

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      <NavLink 
        to="/books" 
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        aria-label="View all books"
      >
        <BooksIcon />
        <span>Books</span>
      </NavLink>
      
      <NavLink 
        to="/add" 
        className="nav-item add-button"
        aria-label="Add a new book"
      >
        <div className="add-icon-container" role="presentation">
          <AddIcon />
        </div>
        <span>Add</span>
      </NavLink>
      
      <NavLink 
        to="/" 
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        aria-label="Go to home page"
      >
        <HomeIcon />
        <span>Home</span>
      </NavLink>
    </nav>
  );
};

export default MobileBottomNav; 