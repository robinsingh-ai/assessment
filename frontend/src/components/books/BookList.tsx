import React from 'react';
import { Book } from '../../types';
import { useBookStore } from '../../store/bookStore';
import './BookList.css';

// This will be a container component that manages state and logic
const BookList: React.FC = () => {
  // Use state from Zustand store
  const { books, deleteBook } = useBookStore();

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete ${title}?`)) {
      deleteBook(id);
    }
  };

  return (
    <div className="book-list-container">
      <h1>Library Management System</h1>
      <div className="actions">
        <button onClick={() => window.location.href = '/add'}>Add New Book</button>
      </div>
      <div className="book-grid">
        {books.map(book => (
          <div key={book.id} className="book-card">
            <h3>{book.title}</h3>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Year:</strong> {book.yearPublished}</p>
            <p><strong>Genre:</strong> {book.genre}</p>
            <div className="book-actions">
              <button onClick={() => window.location.href = `/edit/${book.id}`}>Edit</button>
              <button onClick={() => handleDelete(book.id, book.title)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookList; 