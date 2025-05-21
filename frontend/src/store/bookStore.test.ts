import { act, renderHook } from '@testing-library/react';
import { useBookStore } from './bookStore';
import { BookAPI } from '../services/api';
import { Book } from '../types';

// Integration tests for the book store

describe('Book Store Integration Tests', () => {
  // Test book to be used for create/update/delete operations
  let testBook: Omit<Book, 'id'>;
  let createdBookId: string;
  
  // Reset the store before each test
  beforeEach(async () => {
    // Create a fresh store within act
    await act(async () => {
      const initialState = useBookStore.getState();
      useBookStore.setState({
        ...initialState,
        books: [],
        loading: false,
        error: null
      });
    });
  });
  
  // After all tests, clean up any books created during testing
  afterAll(async () => {
    if (createdBookId) {
      try {
        await BookAPI.deleteBook(createdBookId);
      } catch (error) {
        console.log('Cleanup error (can be ignored if book was already deleted in tests):', error);
      }
    }
  });
  
  describe('fetchBooks', () => {
    test('should fetch books from the backend', async () => {
      const { result } = renderHook(() => useBookStore());
      
      // Initial state
      expect(result.current.books).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      
      // Fetch books
      await act(async () => {
        await result.current.fetchBooks();
      });
      
      // After fetch - we should have books from the backend
      expect(Array.isArray(result.current.books)).toBe(true);
      expect(result.current.books.length).toBeGreaterThan(0);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      
      // Verify the structure of the first book
      const firstBook = result.current.books[0];
      expect(firstBook).toHaveProperty('id');
      expect(firstBook).toHaveProperty('isbn');
      expect(firstBook).toHaveProperty('title');
      expect(firstBook).toHaveProperty('author');
      expect(firstBook).toHaveProperty('yearPublished');
      expect(firstBook).toHaveProperty('genre');
    });
  });
  
  describe('CRUD Operations', () => {
    test('should perform full CRUD lifecycle: create, read, update, delete', async () => {
      const { result } = renderHook(() => useBookStore());
      
      // 1. CREATE: Add a new book with random ISBN to avoid conflicts
      const isbn = `978${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      testBook = {
        isbn,
        title: 'Integration Test Book',
        author: 'Test Author',
        yearPublished: 2023,
        genre: 'Test'
      };
      
      await act(async () => {
        await result.current.addBook(testBook);
      });
      
      // Verify book was added
      expect(result.current.books.length).toBe(1);
      expect(result.current.books[0].isbn).toBe(testBook.isbn);
      expect(result.current.books[0].title).toBe(testBook.title);
      expect(result.current.error).toBeNull();
      
      // Save ID for later use
      createdBookId = result.current.books[0].id;
      
      // 2. READ: Fetch all books to verify our book is there
      await act(async () => {
        await result.current.fetchBooks();
      });
      
      // Find our test book in the results
      const fetchedBook = result.current.books.find(book => book.id === createdBookId);
      expect(fetchedBook).toBeDefined();
      expect(fetchedBook?.isbn).toBe(testBook.isbn);
      
      // 3. UPDATE: Update the book
      const updatedData = {
        ...testBook,
        title: 'Updated Integration Test Book',
        genre: 'Updated Test'
      };
      
      await act(async () => {
        await result.current.updateBook(createdBookId, updatedData);
      });
      
      // Verify update was successful
      const updatedBook = result.current.getBook(createdBookId);
      expect(updatedBook).toBeDefined();
      expect(updatedBook?.title).toBe('Updated Integration Test Book');
      expect(updatedBook?.genre).toBe('Updated Test');
      expect(result.current.error).toBeNull();
      
      // 4. DELETE: Delete the book
      await act(async () => {
        await result.current.deleteBook(createdBookId);
      });
      
      // Verify book was deleted
      expect(result.current.books.find(book => book.id === createdBookId)).toBeUndefined();
      expect(result.current.error).toBeNull();
      
      // Clear createdBookId since we deleted it
      createdBookId = '';
    });
  });
  
  describe('Edge Cases', () => {
    test('should handle non-existent book', async () => {
      const { result } = renderHook(() => useBookStore());
      
      // Try to get a non-existent book
      const nonExistentBook = result.current.getBook('non-existent-id');
      expect(nonExistentBook).toBeUndefined();
      
      // Try to update a non-existent book
      let updateError: Error | null = null;
      await act(async () => {
        try {
          await result.current.updateBook('non-existent-id', {
            isbn: '9781234567897',
            title: 'Non Existent',
            author: 'Nobody',
            yearPublished: 2023,
            genre: 'Fiction'
          });
        } catch (error) {
          updateError = error as Error;
        }
      });
      
      // Should have an error
      expect(updateError).toBeTruthy();
      expect(result.current.error).toBeTruthy();
      
      // Reset error state for next test
      await act(async () => {
        useBookStore.setState({ error: null });
      });
      
      // Try to delete a non-existent book
      let deleteError: Error | null = null;
      await act(async () => {
        try {
          await result.current.deleteBook('non-existent-id');
        } catch (error) {
          deleteError = error as Error;
        }
      });
      
      // Should have an error
      expect(deleteError).toBeTruthy();
      expect(result.current.error).toBeTruthy();
    });
    
    test('should handle invalid book data', async () => {
      const { result } = renderHook(() => useBookStore());
      
      // Try to add a book with invalid data
      const invalidBook = {
        isbn: '978123456789', // Too short
        title: 'Invalid Book',
        author: 'Test Author',
        yearPublished: 2023,
        genre: 'Test'
      };
      
      let createError: Error | null = null;
      await act(async () => {
        try {
          await result.current.addBook(invalidBook as any);
        } catch (error) {
          createError = error as Error;
        }
      });
      
      // Should have an error
      expect(createError).toBeTruthy();
      expect(result.current.error).toBeTruthy();
    });
    
    test('should handle duplicate ISBN', async () => {
      const { result } = renderHook(() => useBookStore());
      
      // First, fetch all books to get an existing ISBN
      await act(async () => {
        await result.current.fetchBooks();
      });
      
      // Make sure we have at least one book
      if (result.current.books.length === 0) {
        throw new Error('Need at least one book in database for this test');
      }
      
      // Get an existing ISBN
      const existingISBN = result.current.books[0].isbn;
      
      // Try to add a book with duplicate ISBN
      const duplicateBook = {
        isbn: existingISBN,
        title: 'Duplicate ISBN Book',
        author: 'Test Author',
        yearPublished: 2023,
        genre: 'Test'
      };
      
      let duplicateError: Error | null = null;
      await act(async () => {
        try {
          await result.current.addBook(duplicateBook);
        } catch (error) {
          duplicateError = error as Error;
        }
      });
      
      // Should have an error
      expect(duplicateError).toBeTruthy();
      expect(result.current.error).toBeTruthy();
    });
  });
  
  describe('State Management', () => {
    test('should properly track loading state', async () => {
      // Create a mock implementation of BookAPI.getAllBooks that we can control
      const originalGetAllBooks = BookAPI.getAllBooks;
      
      // Create a promise that we can resolve manually
      let promiseResolve: (value: Book[]) => void;
      const delayedPromise = new Promise<Book[]>((resolve) => {
        promiseResolve = resolve;
      });
      
      // Mock implementation that returns our controlled promise
      BookAPI.getAllBooks = jest.fn().mockImplementation(() => delayedPromise);
      
      try {
        const { result } = renderHook(() => useBookStore());
        
        // Initial state
        expect(result.current.loading).toBe(false);
        
        // Start the fetch but don't await it
        let fetchPromise: Promise<void>;
        
        act(() => {
          fetchPromise = result.current.fetchBooks();
        });
        
        // Now the loading state should be true
        expect(result.current.loading).toBe(true);
        
        // Resolve the API promise with some data
        await act(async () => {
          promiseResolve([]);
          await fetchPromise;
        });
        
        // After resolution, loading should be false
        expect(result.current.loading).toBe(false);
      } finally {
        // Restore the original implementation
        BookAPI.getAllBooks = originalGetAllBooks;
      }
    });
    
    test('should clear error state on successful operations', async () => {
      const { result } = renderHook(() => useBookStore());
      
      // Set an initial error (wrapped in act)
      await act(async () => {
        useBookStore.setState({ error: 'Previous error' });
      });
      
      // Verify error was set
      expect(result.current.error).toBe('Previous error');
      
      // Perform successful operation
      const isbn = `978${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      testBook = {
        isbn,
        title: 'Clear Error Test Book',
        author: 'Test Author',
        yearPublished: 2023,
        genre: 'Test'
      };
      
      await act(async () => {
        await result.current.addBook(testBook);
      });
      
      // Error should be cleared
      expect(result.current.error).toBeNull();
      
      // Save ID for cleanup
      createdBookId = result.current.books[0].id;
      
      // Clean up
      await act(async () => {
        await result.current.deleteBook(createdBookId);
      });
      
      // Clear ID as we deleted it
      createdBookId = '';
    });
  });
}); 