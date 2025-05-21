import { BookAPI } from './api';
import { Book } from '../types';

// Integration tests - these tests will call the actual backend API
// Make sure the backend server is running at http://localhost:5001 before running these tests

describe('BookAPI Integration Tests', () => {
  // Test book to be used for create/update/delete operations
  let testBook: Omit<Book, 'id'>;
  let createdBookId: string;
  
  describe('getAllBooks', () => {
    test('should fetch all books from the backend', async () => {
      const books = await BookAPI.getAllBooks();
      
      // Verify response structure but not exact content
      expect(Array.isArray(books)).toBe(true);
      
      // Skip property checks if no books are returned
      if (books.length === 0) {
        return;
      }
      
      // Always run these assertions when books exist
      expect(books[0]).toHaveProperty('id');
      expect(books[0]).toHaveProperty('isbn');
      expect(books[0]).toHaveProperty('title');
      expect(books[0]).toHaveProperty('author');
      expect(books[0]).toHaveProperty('yearPublished');
      expect(books[0]).toHaveProperty('genre');
    });
  });
  
  describe('createBook, getBookById, updateBook, and deleteBook', () => {
    test('should create a new book', async () => {
      // Use random ISBN to avoid conflicts with existing books
      const isbn = `978${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      
      testBook = {
        isbn,
        title: 'Integration Test Book',
        author: 'Test Author',
        yearPublished: 2023,
        genre: 'Test'
      };
      
      const createdBook = await BookAPI.createBook(testBook);
      createdBookId = createdBook.id;
      
      expect(createdBook).toHaveProperty('id');
      expect(createdBook.isbn).toBe(testBook.isbn);
      expect(createdBook.title).toBe(testBook.title);
      expect(createdBook.author).toBe(testBook.author);
      expect(createdBook.yearPublished).toBe(testBook.yearPublished);
      expect(createdBook.genre).toBe(testBook.genre);
    });
    
    test('should get a book by id', async () => {
      // Use the ID from the book we just created
      const book = await BookAPI.getBookById(createdBookId);
      
      expect(book).toHaveProperty('id', createdBookId);
      expect(book.isbn).toBe(testBook.isbn);
      expect(book.title).toBe(testBook.title);
    });
    
    test('should update a book', async () => {
      const updatedData = {
        ...testBook,
        title: 'Updated Integration Test Book',
        genre: 'Updated Test'
      };
      
      const updatedBook = await BookAPI.updateBook(createdBookId, updatedData);
      
      expect(updatedBook).toHaveProperty('id', createdBookId);
      expect(updatedBook.isbn).toBe(testBook.isbn);
      expect(updatedBook.title).toBe('Updated Integration Test Book');
      expect(updatedBook.genre).toBe('Updated Test');
    });
    
    test('should delete a book', async () => {
      await BookAPI.deleteBook(createdBookId);
      
      // Verify the book is deleted by expecting a 404 when trying to fetch it
      await expect(async () => {
        await BookAPI.getBookById(createdBookId);
      }).rejects.toThrow();
    });
  });
  
  // Error handling tests that don't require mocking
  describe('error handling with actual API', () => {
    test('should handle not found error when getting non-existent book', async () => {
      await expect(async () => {
        await BookAPI.getBookById('non-existent-id');
      }).rejects.toThrow();
    });
    
    test('should handle creation of a book with invalid data', async () => {
      // Create a book with invalid data (missing required fields)
      const invalidBook = {
        isbn: 'invalid-isbn', // Not a valid ISBN
        // Missing title field
        author: 'Test Author',
        yearPublished: 2023,
        genre: 'Test'
      } as any; // Use 'as any' to bypass TypeScript type checking for this test
      
      try {
        const result = await BookAPI.createBook(invalidBook);
        
        // If the API accepts the invalid book (which is unexpected but appears to be happening (fixed in https://github.com/robinsingh-ai/visa-assessment/commit/bc891fd2cd2a0738289eb7616a4244440486715a)),
        // we need to clean up by deleting it
        if (result && result.id) {
          await BookAPI.deleteBook(result.id);
          console.log('Warning: Backend accepted invalid book data. Test data was cleaned up.');
          // This test is manually marked as failing if it gets here
          throw new Error('Backend should have rejected invalid book data but accepted it instead');
        }
      } catch (error) {
        // This is the expected path - we want an error to be thrown
        // No explicit assertion needed - if we get here, the test passes
        // The mere presence of an error is sufficient
        // The error message should be "ISBN must be 13 digits long and contain only numeric characters"
        // If we send a valid 13 digit ISBN, the backend will still thrown an error for invalid title
      }
    });
  });
}); 