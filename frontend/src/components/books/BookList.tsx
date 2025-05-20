import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookStore } from '../../store/bookStore';
import PageContainer from '../layout/PageContainer';
import BookCard from './BookCard';
import Button from '../common/Button';
import './BookList.css';

// This will be a container component that manages state and logic
const BookList: React.FC = () => {
  const navigate = useNavigate();
  const { books, loading, error, fetchBooks, deleteBook } = useBookStore();
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch books on component mount
  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

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
    <PageContainer title="Library Management System">
      <div className="actions">
        <Button onClick={() => navigate('/add')}>Add New Book</Button>
      </div>

      {loading && !isDeleting && <div className="loading">Loading books...</div>}
      
      {error && <div className="error-message">Error: {error}</div>}
      
      {!loading && books.length === 0 && (
        <div className="empty-state">No books found. Add some books to get started!</div>
      )}
      
      <div className="book-grid">
        {books.map(book => (
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