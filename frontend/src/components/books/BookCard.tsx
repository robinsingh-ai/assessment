import React from 'react';
import { Book } from '../../types';
import Button from '../common/Button';
import './BookCard.css';

// Edit and Delete icons
const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="currentColor"/>
  </svg>
);

const DeleteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="currentColor"/>
  </svg>
);

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
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onEdit(book.id)}
          icon={<EditIcon />}
          iconPosition="left"
          ariaLabel={`Edit ${book.title}`}
        >
          Edit
        </Button>
        <Button 
          variant="danger" 
          size="sm" 
          onClick={() => onDelete(book.id, book.title)}
          icon={<DeleteIcon />}
          iconPosition="left"
          ariaLabel={`Delete ${book.title}`}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default BookCard; 