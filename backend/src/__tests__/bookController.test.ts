import { Request, Response, NextFunction } from 'express';
import * as bookController from '../controllers/bookController';
import { BookService } from '../services/bookService';
import { ApiError } from '../middleware/errorHandler';

// Sample book data
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

const newBookData = {
  isbn: '9781234567897',
  title: 'Test Book',
  author: 'Test Author',
  yearPublished: 2020,
  genre: 'Test'
};

describe('Book Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock<NextFunction>;
  let mockService: Partial<BookService>;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create mock BookService
    mockService = {
      getAllBooks: jest.fn(),
      getBookById: jest.fn(),
      createBook: jest.fn(),
      updateBook: jest.fn(),
      deleteBook: jest.fn()
    };
    
    // Setup request, response, and next function mocks
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
    next = jest.fn();
  });
  
  describe('getAllBooks', () => {
    test('should return all books with status 200', async () => {
      // Set up the mock to return books
      (mockService.getAllBooks as jest.Mock).mockReturnValue(mockBooks);
      
      // Call the controller function with our mock service
      await bookController.getAllBooks(req as Request, res as Response, next, mockService as BookService);
      
      // Verify service was called
      expect(mockService.getAllBooks).toHaveBeenCalled();
      
      // Verify response
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockBooks);
    });
    
    test('should pass error to next middleware if service throws', async () => {
      // Set up the mock to throw an error
      const error = new Error('Database error');
      (mockService.getAllBooks as jest.Mock).mockImplementation(() => {
        throw error;
      });
      
      // Call the controller function with our mock service
      await bookController.getAllBooks(req as Request, res as Response, next, mockService as BookService);
      
      // Verify error was passed to next
      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
  
  describe('getBookById', () => {
    test('should return a specific book with status 200', async () => {
      // Setup request params
      req.params = { id: '1' };
      
      // Set up the mock to return a book
      (mockService.getBookById as jest.Mock).mockReturnValue(mockBooks[0]);
      
      // Call the controller function with our mock service
      await bookController.getBookById(req as Request, res as Response, next, mockService as BookService);
      
      // Verify service was called with correct ID
      expect(mockService.getBookById).toHaveBeenCalledWith('1');
      
      // Verify response
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockBooks[0]);
    });
    
    test('should return 404 if book is not found', async () => {
      // Setup request params
      req.params = { id: '999' };
      
      // Set up the mock to return undefined (not found)
      (mockService.getBookById as jest.Mock).mockReturnValue(undefined);
      
      // Call the controller function with our mock service
      await bookController.getBookById(req as Request, res as Response, next, mockService as BookService);
      
      // Verify error was passed to next
      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(404);
      expect(next.mock.calls[0][0].message).toBe('Book not found');
    });
    
    test('should pass error to next middleware if service throws', async () => {
      // Setup request params
      req.params = { id: '1' };
      
      // Set up the mock to throw an error
      const error = new Error('Database error');
      (mockService.getBookById as jest.Mock).mockImplementation(() => {
        throw error;
      });
      
      // Call the controller function with our mock service
      await bookController.getBookById(req as Request, res as Response, next, mockService as BookService);
      
      // Verify error was passed to next
      expect(next).toHaveBeenCalledWith(error);
    });
  });
  
  describe('createBook', () => {
    test('should create a book and return it with status 201', async () => {
      // Setup request body
      req.body = newBookData;
      
      // Set up the mock to return the new book with ID
      const createdBook = { id: '3', ...newBookData };
      (mockService.createBook as jest.Mock).mockReturnValue(createdBook);
      
      // Call the controller function with our mock service
      await bookController.createBook(req as Request, res as Response, next, mockService as BookService);
      
      // Verify service was called with correct data
      expect(mockService.createBook).toHaveBeenCalledWith(newBookData);
      
      // Verify response
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdBook);
    });
    
    test('should pass error to next middleware if service throws', async () => {
      // Setup request body
      req.body = newBookData;
      
      // Set up the mock to throw an error
      const error = new Error('Database error');
      (mockService.createBook as jest.Mock).mockImplementation(() => {
        throw error;
      });
      
      // Call the controller function with our mock service
      await bookController.createBook(req as Request, res as Response, next, mockService as BookService);
      
      // Verify error was passed to next
      expect(next).toHaveBeenCalledWith(error);
    });
  });
  
  describe('updateBook', () => {
    test('should update a book and return it with status 200', async () => {
      // Setup request params and body
      req.params = { id: '1' };
      req.body = {
        isbn: '9780061120084',
        title: 'Updated Title',
        author: 'Harper Lee',
        yearPublished: 1960,
        genre: 'Fiction'
      };
      
      // Set up the mock to return the updated book
      const updatedBook = { id: '1', ...req.body };
      (mockService.updateBook as jest.Mock).mockReturnValue(updatedBook);
      
      // Call the controller function with our mock service
      await bookController.updateBook(req as Request, res as Response, next, mockService as BookService);
      
      // Verify service was called with correct data
      expect(mockService.updateBook).toHaveBeenCalledWith('1', req.body);
      
      // Verify response
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedBook);
    });
    
    test('should return 404 if book is not found', async () => {
      // Setup request params and body
      req.params = { id: '999' };
      req.body = {
        isbn: '9781234567897',
        title: 'Test Book',
        author: 'Test Author',
        yearPublished: 2020,
        genre: 'Test'
      };
      
      // Set up the mock to return null (not found or update failed)
      (mockService.updateBook as jest.Mock).mockReturnValue(null);
      
      // Call the controller function with our mock service
      await bookController.updateBook(req as Request, res as Response, next, mockService as BookService);
      
      // Verify error was passed to next
      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(404);
      expect(next.mock.calls[0][0].message).toBe('Book not found');
    });
    
    test('should pass error to next middleware if service throws', async () => {
      // Setup request params and body
      req.params = { id: '1' };
      req.body = {
        isbn: '9780061120084',
        title: 'Updated Title',
        author: 'Harper Lee',
        yearPublished: 1960,
        genre: 'Fiction'
      };
      
      // Set up the mock to throw an error
      const error = new Error('Database error');
      (mockService.updateBook as jest.Mock).mockImplementation(() => {
        throw error;
      });
      
      // Call the controller function with our mock service
      await bookController.updateBook(req as Request, res as Response, next, mockService as BookService);
      
      // Verify error was passed to next
      expect(next).toHaveBeenCalledWith(error);
    });
  });
  
  describe('deleteBook', () => {
    test('should delete a book and return 204 No Content', async () => {
      // Setup request params
      req.params = { id: '1' };
      
      // Set up the mock to return true (deleted successfully)
      (mockService.deleteBook as jest.Mock).mockReturnValue(true);
      
      // Call the controller function with our mock service
      await bookController.deleteBook(req as Request, res as Response, next, mockService as BookService);
      
      // Verify service was called with correct ID
      expect(mockService.deleteBook).toHaveBeenCalledWith('1');
      
      // Verify response
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
    
    test('should return 404 if book is not found', async () => {
      // Setup request params
      req.params = { id: '999' };
      
      // Set up the mock to return false (not found or delete failed)
      (mockService.deleteBook as jest.Mock).mockReturnValue(false);
      
      // Call the controller function with our mock service
      await bookController.deleteBook(req as Request, res as Response, next, mockService as BookService);
      
      // Verify error was passed to next
      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(404);
      expect(next.mock.calls[0][0].message).toBe('Book not found');
    });
    
    test('should pass error to next middleware if service throws', async () => {
      // Setup request params
      req.params = { id: '1' };
      
      // Set up the mock to throw an error
      const error = new Error('Database error');
      (mockService.deleteBook as jest.Mock).mockImplementation(() => {
        throw error;
      });
      
      // Call the controller function with our mock service
      await bookController.deleteBook(req as Request, res as Response, next, mockService as BookService);
      
      // Verify error was passed to next
      expect(next).toHaveBeenCalledWith(error);
    });
  });
}); 