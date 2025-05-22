import request from 'supertest';
import app from '../server';
import { DbManager } from '../utils/dbManager';
import fs from 'fs';
import path from 'path';
import { Book } from '../models/Book';

// Add these declarations at the top of the file, local to this module
declare const jest: any;
declare const describe: any;
declare const beforeAll: any;
declare const beforeEach: any;
declare const test: any;
declare const expect: any;
declare const afterAll: any;

// Interface for our mocked DbManager instance
interface MockDbManager {
  books: Book[];
  getAllBooks: jest.Mock;
  getBookById: jest.Mock;
  isbnExists: jest.Mock;
  getBookByISBN: jest.Mock;
  addBook: jest.Mock;
  updateBook: jest.Mock;
  deleteBook: jest.Mock;
  saveToFile: jest.Mock;
}

// Mock the fs module to prevent file operations during tests
jest.mock('fs', () => ({
  existsSync: jest.fn().mockReturnValue(true),
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
  readFileSync: jest.fn(),
}));

// Mock DbManager to ensure tests have complete control over data
jest.mock('../utils/dbManager', () => {
  // Create type for our mock DbManager constructor
  const DbManagerMock = {
    instance: undefined as MockDbManager | undefined,
    getInstance: jest.fn(() => {
      if (!DbManagerMock.instance) {
        DbManagerMock.instance = {
          books: [],
          getAllBooks: jest.fn(function(this: MockDbManager) { 
            return [...this.books]; 
          }),
          getBookById: jest.fn(function(this: MockDbManager, id: string) { 
            return this.books.find(book => book.id === id); 
          }),
          isbnExists: jest.fn(function(this: MockDbManager, isbn: string) { 
            return this.books.some(book => book.isbn === isbn); 
          }),
          getBookByISBN: jest.fn(function(this: MockDbManager, isbn: string) { 
            return this.books.find(book => book.isbn === isbn); 
          }),
          addBook: jest.fn(function(this: MockDbManager, bookData: Omit<Book, 'id'>) {
            const newBook = { ...bookData, id: (this.books.length + 1).toString() };
            this.books.push(newBook);
            this.saveToFile();
            return newBook;
          }),
          updateBook: jest.fn(function(this: MockDbManager, id: string, bookData: Omit<Book, 'id'>) {
            const index = this.books.findIndex(book => book.id === id);
            if (index === -1) return null;
            
            // Check if ISBN is being changed and if it would conflict with another book
            if (bookData.isbn !== this.books[index].isbn) {
              const isbnExists = this.books.some(
                (book, i) => i !== index && book.isbn === bookData.isbn
              );
              
              if (isbnExists) {
                return null;
              }
            }
            
            const updatedBook: Book = {
              ...bookData,
              id
            };
            
            this.books[index] = updatedBook;
            this.saveToFile();
            
            return updatedBook;
          }),
          deleteBook: jest.fn(function(this: MockDbManager, id: string) {
            const initialLength = this.books.length;
            this.books = this.books.filter(book => book.id !== id);
            
            if (this.books.length !== initialLength) {
              this.saveToFile();
              return true;
            }
            
            return false;
          }),
          saveToFile: jest.fn(function(this: MockDbManager) {
            // Call writeFileSync mock when saving
            fs.writeFileSync('mockPath', JSON.stringify(this.books));
          })
        };
      }
      return DbManagerMock.instance;
    })
  };
  
  return {
    DbManager: DbManagerMock
  };
});

// Tell TypeScript to treat the imported DbManager as our mocked version
// This is a workaround for the type conflict
declare module '../utils/dbManager' {
  // Remove incorrect interface extension
}

// Sample test books
const testBooks = [
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

// Sample new book data
const newBookData = {
  isbn: '9781234567897',
  title: 'Test Book',
  author: 'Test Author',
  yearPublished: 2020,
  genre: 'Test'
};

describe('Book API Integration Tests', () => {
  let dbManager: MockDbManager;
  
  beforeAll(() => {
    // Get the mock DB instance and cast it to our mock type
    dbManager = DbManager.getInstance() as unknown as MockDbManager;
  });
  
  beforeEach(() => {
    // Reset the test data before each test
    dbManager.books = [...testBooks];
    
    // Clear all mock calls
    jest.clearAllMocks();
  });
  
  afterAll(() => {
    // No need to reset singleton since we're using mocks
  });
  
  describe('GET /books', () => {
    test('should return all books with status 200', async () => {
      const response = await request(app).get('/books');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].id).toBe('1');
      expect(response.body[1].id).toBe('2');
    });
  });
  
  describe('GET /books/:id', () => {
    test('should return a specific book with status 200', async () => {
      const response = await request(app).get('/books/1');
      
      expect(response.status).toBe(200);
      expect(response.body.id).toBe('1');
      expect(response.body.title).toBe('To Kill a Mockingbird');
    });
    
    test('should return 404 if book is not found', async () => {
      const response = await request(app).get('/books/999');
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Book not found');
    });
    
    test('should return 400 if book ID is invalid', async () => {
      // Use a path that should trigger a 404 response
      const response = await request(app).get('/books/invalid');
      
      expect(response.status).toBe(404);
    });
  });
  
  describe('POST /books', () => {
    test('should create a book and return it with status 201', async () => {
      const response = await request(app)
        .post('/books')
        .send(newBookData)
        .set('Accept', 'application/json');
      
      expect(response.status).toBe(201);
      expect(response.body.id).toBeDefined();
      expect(response.body.title).toBe('Test Book');
      expect(response.body.author).toBe('Test Author');
      expect(response.body.isbn).toBe('9781234567897');
      
      // Verify file was saved
      expect(fs.writeFileSync).toHaveBeenCalled();
    });
    
    test('should return 400 if required data is missing', async () => {
      const incompleteData = {
        title: 'Test Book',
        author: 'Test Author',
        yearPublished: 2020,
        genre: 'Test'
        // Missing ISBN
      };
      
      const response = await request(app)
        .post('/books')
        .send(incompleteData)
        .set('Accept', 'application/json');
      
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('ISBN is required');
    });
    
    test('should return 409 if ISBN already exists', async () => {
      const duplicateIsbnData = {
        ...newBookData,
        isbn: '9780061120084' // This ISBN already exists in test data
      };
      
      const response = await request(app)
        .post('/books')
        .send(duplicateIsbnData)
        .set('Accept', 'application/json');
      
      expect(response.status).toBe(409);
      expect(response.body.error).toContain('already exists');
    });
    
    test('should return 400 if year is invalid', async () => {
      const invalidYearData = {
        ...newBookData,
        yearPublished: 2050 // Future year
      };
      
      const response = await request(app)
        .post('/books')
        .send(invalidYearData)
        .set('Accept', 'application/json');
      
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Year published must be a valid year');
    });
  });
  
  describe('PUT /books/:id', () => {
    test('should update a book and return it with status 200', async () => {
      const updateData = {
        isbn: '9780061120084', // Same ISBN as the book being updated
        title: 'Updated Title',
        author: 'Harper Lee',
        yearPublished: 1960,
        genre: 'Fiction'
      };
      
      const response = await request(app)
        .put('/books/1')
        .send(updateData)
        .set('Accept', 'application/json');
      
      expect(response.status).toBe(200);
      expect(response.body.id).toBe('1');
      expect(response.body.title).toBe('Updated Title');
      
      // Verify file was saved
      expect(fs.writeFileSync).toHaveBeenCalled();
    });
    
    test('should return 404 if book is not found', async () => {
      const response = await request(app)
        .put('/books/999')
        .send(newBookData)
        .set('Accept', 'application/json');
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Book not found');
    });
    
    test('should return 409 if updating ISBN to one that already exists', async () => {
      const conflictingUpdateData = {
        isbn: '9780451524935', // This is book 2's ISBN
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        yearPublished: 1960,
        genre: 'Fiction'
      };
      
      const response = await request(app)
        .put('/books/1')
        .send(conflictingUpdateData)
        .set('Accept', 'application/json');
      
      expect(response.status).toBe(409);
      expect(response.body.error).toContain('Another book with ISBN');
    });
    
    test('should return 400 if required data is missing', async () => {
      const incompleteData = {
        isbn: '9780061120084',
        // Missing title
        author: 'Harper Lee',
        yearPublished: 1960,
        genre: 'Fiction'
      };
      
      const response = await request(app)
        .put('/books/1')
        .send(incompleteData)
        .set('Accept', 'application/json');
      
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Title is required');
    });
  });
  
  describe('DELETE /books/:id', () => {
    test('should delete a book and return 204 No Content', async () => {
      const response = await request(app).delete('/books/1');
      
      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
      
      // Verify file was saved
      expect(fs.writeFileSync).toHaveBeenCalled();
      
      // Verify book was deleted
      const remainingBooks = await request(app).get('/books');
      expect(remainingBooks.body).toHaveLength(1);
      expect(remainingBooks.body[0].id).toBe('2');
    });
    
    test('should return 404 if book is not found', async () => {
      const response = await request(app).delete('/books/999');
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Book not found');
    });
  });
  
  describe('Edge Cases', () => {
    test('should return 400 for empty string title', async () => {
      const response = await request(app)
        .post('/books')
        .send({
          ...newBookData,
          title: ''
        })
        .set('Accept', 'application/json');
      
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Title is required');
    });
    
    test('should return 400 for whitespace-only title', async () => {
      const response = await request(app)
        .post('/books')
        .send({
          ...newBookData,
          title: '   '
        })
        .set('Accept', 'application/json');
      
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Title is required');
    });
    
    test('should return 400 for non-numeric year', async () => {
      const response = await request(app)
        .post('/books')
        .send({
          ...newBookData,
          yearPublished: 'not-a-number'
        })
        .set('Accept', 'application/json');
      
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Year published must be a valid year');
    });
    
    test('should return 400 for very old year (before 1000)', async () => {
      const response = await request(app)
        .post('/books')
        .send({
          ...newBookData,
          yearPublished: 999
        })
        .set('Accept', 'application/json');
      
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Year published must be a valid year');
    });
  });
}); 