import { useEffect } from 'react';
import { useBookStore } from '../store/bookStore';
import { Book } from '../types';

interface UseBookDataProps {
  id?: string;
  autoFetch?: boolean;
}

export const useBookData = ({ id, autoFetch = true }: UseBookDataProps = {}) => {
  const { 
    books, 
    loading, 
    error, 
    fetchBooks, 
    getBook
  } = useBookStore();

  // Auto-fetch books if needed
  useEffect(() => {
    if (autoFetch && books.length === 0) {
      fetchBooks();
    }
  }, [autoFetch, books.length, fetchBooks]);

  // Find specific book if ID is provided
  const book = id ? getBook(id) : undefined;
  const notFound = id && books.length > 0 && !book;

  return {
    books,
    book,
    loading,
    error,
    notFound,
    fetchBooks,
    getBook
  };
}; 