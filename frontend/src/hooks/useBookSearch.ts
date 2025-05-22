import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Book } from '../types';

// Custom hook to get query parameters from URL
export const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

interface UseBookSearchProps {
  books: Book[];
}

export const useBookSearch = ({ books }: UseBookSearchProps) => {
  const query = useQuery();
  const searchParam = query.get('search');
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(books);

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

  return {
    searchParam,
    filteredBooks
  };
}; 