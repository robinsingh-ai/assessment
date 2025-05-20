import { create } from 'zustand';
import { Book } from '../types';
import { BookAPI } from '../services/api';

interface BookState {
  books: Book[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchBooks: () => Promise<void>;
  addBook: (book: Omit<Book, 'id'>) => Promise<void>;
  updateBook: (id: string, updatedBook: Omit<Book, 'id'>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  getBook: (id: string) => Book | undefined;
}

export const useBookStore = create<BookState>((set, get) => ({
  books: [],
  loading: false,
  error: null,
  
  fetchBooks: async () => {
    set({ loading: true, error: null });
    try {
      const books = await BookAPI.getAllBooks();
      set({ books, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Unknown error fetching books', 
        loading: false 
      });
    }
  },
  
  addBook: async (book) => {
    set({ loading: true, error: null });
    try {
      const newBook = await BookAPI.createBook(book);
      set((state) => ({ 
        books: [...state.books, newBook], 
        loading: false 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Unknown error adding book', 
        loading: false 
      });
      throw error;
    }
  },
  
  updateBook: async (id, updatedBook) => {
    set({ loading: true, error: null });
    try {
      const book = await BookAPI.updateBook(id, updatedBook);
      set((state) => ({
        books: state.books.map(b => b.id === id ? book : b),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : `Unknown error updating book ${id}`, 
        loading: false 
      });
      throw error;
    }
  },
  
  deleteBook: async (id) => {
    set({ loading: true, error: null });
    try {
      await BookAPI.deleteBook(id);
      set((state) => ({
        books: state.books.filter(book => book.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : `Unknown error deleting book ${id}`, 
        loading: false 
      });
      throw error;
    }
  },
  
  getBook: (id) => {
    return get().books.find(book => book.id === id);
  }
})); 