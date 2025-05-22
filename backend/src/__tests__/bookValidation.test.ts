import { Request, Response, NextFunction } from 'express';
import { validateBookData, validateBookId, checkDuplicateISBN, checkDuplicateISBNOnUpdate } from '../middleware/bookValidation';
import { ApiError } from '../middleware/errorHandler';
import { DbManager } from '../utils/dbManager';

// Mock the DbManager
jest.mock('../utils/dbManager', () => {
  return {
    DbManager: {
      getInstance: jest.fn().mockReturnValue({
        isbnExists: jest.fn(),
        getBookById: jest.fn()
      })
    }
  };
});

describe('Book Validation Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock<NextFunction>;
  let dbManagerMock: { isbnExists: jest.Mock; getBookById: jest.Mock };
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup request, response, and next function mocks
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    
    // Setup DbManager mock
    dbManagerMock = DbManager.getInstance() as any;
  });
  
  describe('validateBookData', () => {
    test('should proceed when all data is valid', () => {
      req.body = {
        isbn: '9781234567897',
        title: 'Test Book',
        author: 'Test Author',
        yearPublished: 2020,
        genre: 'Test'
      };
      
      validateBookData(req as Request, res as Response, next);
      
      expect(next).toHaveBeenCalledWith();
      expect(next).not.toHaveBeenCalledWith(expect.any(ApiError));
    });
    
    test('should reject when ISBN is missing', () => {
      req.body = {
        title: 'Test Book',
        author: 'Test Author',
        yearPublished: 2020,
        genre: 'Test'
      };
      
      validateBookData(req as Request, res as Response, next);
      
      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(400);
      expect(next.mock.calls[0][0].message).toContain('ISBN is required');
    });
    
    test('should reject when ISBN is not a string', () => {
      req.body = {
        isbn: 123456789,
        title: 'Test Book',
        author: 'Test Author',
        yearPublished: 2020,
        genre: 'Test'
      };
      
      validateBookData(req as Request, res as Response, next);
      
      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(400);
      expect(next.mock.calls[0][0].message).toContain('ISBN is required and must be a string');
    });
    
    test('should reject when title is missing', () => {
      req.body = {
        isbn: '9781234567897',
        author: 'Test Author',
        yearPublished: 2020,
        genre: 'Test'
      };
      
      validateBookData(req as Request, res as Response, next);
      
      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].message).toContain('Title is required');
    });
    
    test('should reject when title is empty string', () => {
      req.body = {
        isbn: '9781234567897',
        title: '',
        author: 'Test Author',
        yearPublished: 2020,
        genre: 'Test'
      };
      
      validateBookData(req as Request, res as Response, next);
      
      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].message).toContain('Title is required');
    });
    
    test('should reject when author is missing', () => {
      req.body = {
        isbn: '9781234567897',
        title: 'Test Book',
        yearPublished: 2020,
        genre: 'Test'
      };
      
      validateBookData(req as Request, res as Response, next);
      
      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].message).toContain('Author is required');
    });
    
    test('should reject when genre is missing', () => {
      req.body = {
        isbn: '9781234567897',
        title: 'Test Book',
        author: 'Test Author',
        yearPublished: 2020
      };
      
      validateBookData(req as Request, res as Response, next);
      
      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].message).toContain('Genre is required');
    });
    
    test('should reject when yearPublished is missing', () => {
      req.body = {
        isbn: '9781234567897',
        title: 'Test Book',
        author: 'Test Author',
        genre: 'Test'
      };
      
      validateBookData(req as Request, res as Response, next);
      
      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].message).toContain('Year published must be a valid year');
    });
    
    test('should reject when yearPublished is not a number', () => {
      req.body = {
        isbn: '9781234567897',
        title: 'Test Book',
        author: 'Test Author',
        yearPublished: 'not-a-number',
        genre: 'Test'
      };
      
      validateBookData(req as Request, res as Response, next);
      
      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].message).toContain('Year published must be a valid year');
    });
    
    test('should reject when yearPublished is earlier than 1000', () => {
      req.body = {
        isbn: '9781234567897',
        title: 'Test Book',
        author: 'Test Author',
        yearPublished: 999,
        genre: 'Test'
      };
      
      validateBookData(req as Request, res as Response, next);
      
      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].message).toContain('Year published must be a valid year');
    });
    
    test('should reject when yearPublished is in the future', () => {
      const futureYear = new Date().getFullYear() + 1;
      
      req.body = {
        isbn: '9781234567897',
        title: 'Test Book',
        author: 'Test Author',
        yearPublished: futureYear,
        genre: 'Test'
      };
      
      validateBookData(req as Request, res as Response, next);
      
      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].message).toContain('Year published must be a valid year');
    });
    
    test('should handle unexpected errors', () => {
      // Simulate an unexpected error during validation
      req.body = null;
      
      validateBookData(req as Request, res as Response, next);
      
      // Should call next with the error
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
  
  describe('validateBookId', () => {
    test('should proceed when ID is valid', () => {
      req.params = { id: '123' };
      
      validateBookId(req as Request, res as Response, next);
      
      expect(next).toHaveBeenCalledWith();
    });
    
    test('should reject when ID is missing', () => {
      req.params = {};
      
      validateBookId(req as Request, res as Response, next);
      
      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].message).toContain('Valid book ID is required');
    });
    
    test('should reject when ID is empty string', () => {
      req.params = { id: '' };
      
      validateBookId(req as Request, res as Response, next);
      
      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].message).toContain('Valid book ID is required');
    });
    
    test('should reject when ID is whitespace', () => {
      req.params = { id: '   ' };
      
      validateBookId(req as Request, res as Response, next);
      
      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].message).toContain('Valid book ID is required');
    });
  });
  
  describe('checkDuplicateISBN', () => {
    test('should proceed when ISBN is not a duplicate', () => {
      req.body = { isbn: '9781234567897' };
      dbManagerMock.isbnExists.mockReturnValue(false);
      
      checkDuplicateISBN(req as Request, res as Response, next);
      
      expect(dbManagerMock.isbnExists).toHaveBeenCalledWith('9781234567897');
      expect(next).toHaveBeenCalledWith();
    });
    
    test('should reject when ISBN already exists', () => {
      req.body = { isbn: '9781234567897' };
      dbManagerMock.isbnExists.mockReturnValue(true);
      
      checkDuplicateISBN(req as Request, res as Response, next);
      
      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(409);
      expect(next.mock.calls[0][0].message).toContain('already exists');
    });
    
    test('should handle unexpected errors', () => {
      req.body = {};
      dbManagerMock.isbnExists.mockImplementation(() => {
        throw new Error('Unexpected error');
      });
      
      checkDuplicateISBN(req as Request, res as Response, next);
      
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
  
  describe('checkDuplicateISBNOnUpdate', () => {
    test('should proceed when book is not found', () => {
      req.params = { id: '123' };
      req.body = { isbn: '9781234567897' };
      dbManagerMock.getBookById.mockReturnValue(undefined);
      
      checkDuplicateISBNOnUpdate(req as Request, res as Response, next);
      
      expect(dbManagerMock.getBookById).toHaveBeenCalledWith('123');
      expect(next).toHaveBeenCalledWith();
    });
    
    test('should proceed when ISBN is unchanged', () => {
      req.params = { id: '123' };
      req.body = { isbn: '9781234567897' };
      dbManagerMock.getBookById.mockReturnValue({
        id: '123',
        isbn: '9781234567897',
        title: 'Existing Book',
        author: 'Existing Author',
        yearPublished: 2020,
        genre: 'Test'
      });
      
      checkDuplicateISBNOnUpdate(req as Request, res as Response, next);
      
      expect(next).toHaveBeenCalledWith();
      expect(dbManagerMock.isbnExists).not.toHaveBeenCalled();
    });
    
    test('should proceed when ISBN is changed and not a duplicate', () => {
      req.params = { id: '123' };
      req.body = { isbn: '9789876543210' };
      dbManagerMock.getBookById.mockReturnValue({
        id: '123',
        isbn: '9781234567897',
        title: 'Existing Book',
        author: 'Existing Author',
        yearPublished: 2020,
        genre: 'Test'
      });
      dbManagerMock.isbnExists.mockReturnValue(false);
      
      checkDuplicateISBNOnUpdate(req as Request, res as Response, next);
      
      expect(dbManagerMock.isbnExists).toHaveBeenCalledWith('9789876543210');
      expect(next).toHaveBeenCalledWith();
    });
    
    test('should reject when ISBN is changed to an existing one', () => {
      req.params = { id: '123' };
      req.body = { isbn: '9789876543210' };
      dbManagerMock.getBookById.mockReturnValue({
        id: '123',
        isbn: '9781234567897',
        title: 'Existing Book',
        author: 'Existing Author',
        yearPublished: 2020,
        genre: 'Test'
      });
      dbManagerMock.isbnExists.mockReturnValue(true);
      
      checkDuplicateISBNOnUpdate(req as Request, res as Response, next);
      
      expect(next).toHaveBeenCalledWith(expect.any(ApiError));
      expect(next.mock.calls[0][0].statusCode).toBe(409);
      expect(next.mock.calls[0][0].message).toContain('Another book with ISBN');
    });
    
    test('should handle unexpected errors', () => {
      req.params = { id: '123' };
      req.body = { isbn: '9781234567897' };
      dbManagerMock.getBookById.mockImplementation(() => {
        throw new Error('Unexpected error');
      });
      
      checkDuplicateISBNOnUpdate(req as Request, res as Response, next);
      
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
}); 