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
  return (
    <div className="book-card">
      <h3>{book.title}</h3>
      <p><strong>Author:</strong> {book.author}</p>
      <p><strong>Year:</strong> {book.yearPublished}</p>
      <p><strong>Genre:</strong> {book.genre}</p>
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