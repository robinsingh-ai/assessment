import fs from 'fs';
import path from 'path';
import { DbManager } from '../utils/dbManager';

// Add these declarations at the top of the file, local to this module
declare const jest: any;
declare const describe: any;
declare const beforeEach: any;
declare const test: any;
declare const expect: any;

// Mock fs module
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
  readFileSync: jest.fn(),
}));

// Mock console methods
console.log = jest.fn();
console.error = jest.fn();

const testBook = {
  isbn: '9781234567897',
  title: 'Test Book',
  author: 'Test Author',
  yearPublished: 2020,
  genre: 'Test'
};

const mockBooks = [
  {
    id: '1',
    isbn: '9780061120084',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    yearPublished: 1960,
    genre: 'Fiction'
  },
  {
    id: '2',
    isbn: '9780451524935',
    title: '1984',
    author: 'George Orwell',
    yearPublished: 1949,
    genre: 'Dystopian'
  }
];

describe('DbManager', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset the DbManager instance
    // @ts-ignore: Accessing private property for testing
    DbManager.instance = undefined;
  });

  describe('Initialization', () => {
    test('should create data directory if it does not exist', () => {
      // Mock fs.existsSync to return false (directory doesn't exist)
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      
      // Initialize DbManager
      DbManager.getInstance();
      
      // Check if mkdirSync was called
      expect(fs.mkdirSync).toHaveBeenCalled();
    });

    test('should create default JSON file if it does not exist', () => {
      // Directory exists but file doesn't
      (fs.existsSync as jest.Mock)
        .mockReturnValueOnce(true)    // First call (directory check)
        .mockReturnValueOnce(false);  // Second call (file check)
      
      // Initialize DbManager
      DbManager.getInstance();
      
      // Check if writeFileSync was called
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    test('should load existing data if file exists', () => {
      // Both directory and file exist
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockBooks));
      
      // Initialize DbManager
      const dbManager = DbManager.getInstance();
      
      // Check if data was loaded
      expect(dbManager.getAllBooks()).toEqual(mockBooks);
    });

    test('should handle JSON parsing error gracefully', () => {
      // Both directory and file exist, but file contains invalid JSON
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue('invalid-json');
      
      // Initialize DbManager
      const dbManager = DbManager.getInstance();
      
      // Check if error was logged and empty array was used
      expect(console.error).toHaveBeenCalled();
      expect(dbManager.getAllBooks()).toEqual([]);
    });
  });

  describe('Book Operations', () => {
    let dbManager: DbManager;

    beforeEach(() => {
      // Setup for a working DbManager
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockBooks));
      
      dbManager = DbManager.getInstance();
      jest.clearAllMocks(); // Clear mocks after setup
    });

    test('getAllBooks should return a copy of the books array', () => {
      const books = dbManager.getAllBooks();
      
      // Verify it's a different reference (deep copy)
      expect(books).toEqual(mockBooks);
      expect(books).not.toBe(mockBooks);
      
      // Modify the returned array
      books.push({ id: '999', ...testBook });
      
      // Verify the original array is unchanged
      expect(dbManager.getAllBooks()).toEqual(mockBooks);
    });

    test('getBookById should return the correct book', () => {
      const book = dbManager.getBookById('1');
      expect(book).toEqual(mockBooks[0]);
    });

    test('getBookById should return undefined for non-existent id', () => {
      const book = dbManager.getBookById('999');
      expect(book).toBeUndefined();
    });

    test('getBookByISBN should return the correct book', () => {
      const book = dbManager.getBookByISBN('9780061120084');
      expect(book).toEqual(mockBooks[0]);
    });

    test('getBookByISBN should return undefined for non-existent ISBN', () => {
      const book = dbManager.getBookByISBN('9999999999999');
      expect(book).toBeUndefined();
    });

    test('isbnExists should return true for existing ISBN', () => {
      expect(dbManager.isbnExists('9780061120084')).toBe(true);
    });

    test('isbnExists should return false for non-existent ISBN', () => {
      expect(dbManager.isbnExists('9999999999999')).toBe(false);
    });

    test('addBook should add a book and save to file', () => {
      // Add a new book
      const newBook = dbManager.addBook(testBook);
      
      // Verify it has an ID
      expect(newBook.id).toBeDefined();
      
      // Verify book was added
      expect(dbManager.getAllBooks()).toHaveLength(mockBooks.length + 1);
      
      // Verify it was saved to file
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    test('updateBook should update a book and save to file', () => {
      const updatedData = {
        isbn: '9780061120084',
        title: 'Updated Title',
        author: 'Harper Lee',
        yearPublished: 1960,
        genre: 'Fiction'
      };
      
      // Update an existing book
      const updatedBook = dbManager.updateBook('1', updatedData);
      
      // Verify book was updated
      expect(updatedBook).not.toBeNull();
      expect(updatedBook?.title).toBe('Updated Title');
      
      // Verify file was saved
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    test('updateBook should return null for non-existent id', () => {
      const result = dbManager.updateBook('999', testBook);
      expect(result).toBeNull();
    });

    test('updateBook should prevent ISBN conflicts', () => {
      // Try to update book 1 with book 2's ISBN
      const updatedData = {
        isbn: '9780451524935', // This is book 2's ISBN
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        yearPublished: 1960,
        genre: 'Fiction'
      };
      
      const result = dbManager.updateBook('1', updatedData);
      
      // Should fail due to ISBN conflict
      expect(result).toBeNull();
    });

    test('updateBook should allow keeping the same ISBN', () => {
      // Update a book but keep its own ISBN
      const updatedData = {
        isbn: '9780061120084', // Same ISBN as book 1
        title: 'Updated Title',
        author: 'Harper Lee',
        yearPublished: 1960,
        genre: 'Fiction'
      };
      
      const result = dbManager.updateBook('1', updatedData);
      
      // Should succeed
      expect(result).not.toBeNull();
      expect(result?.title).toBe('Updated Title');
    });

    test('deleteBook should remove a book and save to file', () => {
      // Delete an existing book
      const result = dbManager.deleteBook('1');
      
      // Verify book was deleted
      expect(result).toBe(true);
      expect(dbManager.getAllBooks()).toHaveLength(mockBooks.length - 1);
      
      // Verify file was saved
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    test('deleteBook should return false for non-existent id', () => {
      const result = dbManager.deleteBook('999');
      expect(result).toBe(false);
    });

    test('saveToFile should handle errors gracefully', () => {
      // Set up writeFileSync to throw an error
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('Write error');
      });
      
      // Attempt to add a book, which triggers saveToFile
      dbManager.addBook(testBook);
      
      // Verify error was logged
      expect(console.error).toHaveBeenCalled();
    });
  });
}); 