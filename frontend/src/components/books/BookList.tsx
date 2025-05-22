import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../layout/PageContainer';
import BookCard from './BookCard';
import Button from '../common/Button';
import { useBookSearch } from '../../hooks/useBookSearch';
import { useBookActions } from '../../hooks/useBookActions';
import { useBookData } from '../../hooks/useBookData';
import './BookList.css';

// Add Book icon
const AddBookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="currentColor"/>
  </svg>
);

// This will be a container component that manages state and logic
const BookList: React.FC = () => {
  const navigate = useNavigate();
  const { books, loading, error } = useBookData();
  const { searchParam, filteredBooks } = useBookSearch({ books });
  const { isDeleting, deleteError, handleDeleteBook } = useBookActions();

  const handleEdit = (id: string) => {
    navigate(`/edit/${id}`);
  };

  return (
    <PageContainer title={searchParam ? `Search Results: ${searchParam}` : "Library Management System"}>
      <div className="actions">
        <Button 
          variant="success" 
          size="md" 
          onClick={() => navigate('/add')}
          icon={<AddBookIcon />}
          iconPosition="left"
        >
          Add New Book
        </Button>
      </div>

      {loading && !isDeleting && <div className="loading">Loading books...</div>}
      
      {(error || deleteError) && (
        <div className="error-message">
          Error: {error || deleteError}
        </div>
      )}
      
      {!loading && filteredBooks.length === 0 && (
        <div className="empty-state">
          {searchParam 
            ? `No books found matching "${searchParam}". Try a different search term.` 
            : "No books found. Add some books to get started!"}
        </div>
      )}
      
      <div className="book-grid">
        {filteredBooks.map(book => (
          <BookCard
            key={book.id}
            book={book}
            onEdit={handleEdit}
            onDelete={handleDeleteBook}
          />
        ))}
      </div>
    </PageContainer>
  );
};

export default BookList; 