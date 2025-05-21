import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBookStore } from '../../store/bookStore';
import PageContainer from '../layout/PageContainer';
import BookCard from './BookCard';
import Button from '../common/Button';
import './BookList.css';

// Add Book icon
const AddBookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="currentColor"/>
  </svg>
);

// Function to get query parameters from URL
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// This will be a container component that manages state and logic
const BookList: React.FC = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const searchParam = query.get('search');
  
  const { books, loading, error, fetchBooks, deleteBook } = useBookStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [filteredBooks, setFilteredBooks] = useState(books);

  // Fetch books on component mount
  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Filter books when search parameter changes or books change
  useEffect(() => {
    if (searchParam && books.length > 0) {
      const searchTerm = searchParam.toLowerCase();
      const filtered = books.filter(book => 
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.genre.toLowerCase().includes(searchTerm) ||
        book.isbn.toLowerCase().includes(searchTerm)
      );
      setFilteredBooks(filtered);
    } else {
      setFilteredBooks(books);
    }
  }, [searchParam, books]);

  const handleEdit = (id: string) => {
    navigate(`/edit/${id}`);
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete ${title}?`)) {
      try {
        setIsDeleting(true);
        await deleteBook(id);
      } catch (error) {
        console.error('Error deleting book:', error);
        alert('Failed to delete book. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
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
      
      {error && <div className="error-message">Error: {error}</div>}
      
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
            onDelete={handleDelete}
          />
        ))}
      </div>
    </PageContainer>
  );
};

export default BookList; 