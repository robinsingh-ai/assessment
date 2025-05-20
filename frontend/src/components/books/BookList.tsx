import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookStore } from '../../store/bookStore';
import PageContainer from '../layout/PageContainer';
import BookCard from './BookCard';
import Button from '../common/Button';
import './BookList.css';

// This will be a container component that manages state and logic
const BookList: React.FC = () => {
  const navigate = useNavigate();
  // Use state from Zustand store
  const { books, deleteBook } = useBookStore();

  const handleEdit = (id: string) => {
    navigate(`/edit/${id}`);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete ${title}?`)) {
      deleteBook(id);
    }
  };

  return (
    <PageContainer title="Library Management System">
      <div className="actions">
        <Button onClick={() => navigate('/add')}>Add New Book</Button>
      </div>
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