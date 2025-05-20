import React from 'react';
import { Book } from '../../types';
import Button from '../common/Button';
import './BookCard.css';

interface BookCardProps {
  book: Book;
  onEdit: (id: string) => void;
  onDelete: (id: string, title: string) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onEdit, onDelete }) => {
  // Format ISBN with hyphens for display (e.g., 978-3-16-148410-0)
  const formatISBN = (isbn: string): string => {
    // Simple formatting for 13-digit ISBN
    if (isbn.length === 13) {
      return `${isbn.slice(0, 3)}-${isbn.slice(3, 4)}-${isbn.slice(4, 9)}-${isbn.slice(9, 12)}-${isbn.slice(12)}`;
    }
    return isbn;
  };

  return (
    <div className="book-card">
      <h3>{book.title}</h3>
      <p><strong>Author:</strong> {book.author}</p>
      <p><strong>Year:</strong> {book.yearPublished}</p>
      <p><strong>Genre:</strong> {book.genre}</p>
      <p><strong>ISBN:</strong> {formatISBN(book.isbn)}</p>
      <div className="book-actions">
        <Button variant="primary" onClick={() => onEdit(book.id)}>
          Edit
        </Button>
        <Button variant="danger" onClick={() => onDelete(book.id, book.title)}>
          Delete
        </Button>
      </div>
    </div>
  );
};

export default BookCard; 