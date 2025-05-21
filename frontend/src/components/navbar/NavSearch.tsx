import React from 'react';
import Button from '../common/Button';

// Search icon component
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="currentColor"/>
  </svg>
);

// Search Component
interface SearchProps {
    searchTerm: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSearchSubmit: (e: React.FormEvent) => void;
    isOpen: boolean;
  }
  
  export const NavSearch: React.FC<SearchProps> = ({ searchTerm, onSearchChange, onSearchSubmit, isOpen }) => {
    return (
      <div className={`navbar-search ${isOpen ? 'active' : ''}`}>
        <form onSubmit={onSearchSubmit} className="navbar-search-form">
          <input
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={onSearchChange}
            className="search-input"
            aria-label="Search books"
          />
          <Button 
            type="submit" 
            variant="text" 
            className="search-submit-button" 
            icon={<SearchIcon />}
            iconPosition="left"
            ariaLabel="Submit search"
            size="sm"
          >
            Search
          </Button>
        </form>
      </div>
    );
  };