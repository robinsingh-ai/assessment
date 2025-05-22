import { Request, Response, NextFunction } from 'express';
import { ApiError, errorHandler } from '../middleware/errorHandler';

describe('Error Handler Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  
  beforeEach(() => {
    // Setup request and response mocks
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    
    // Mock console.error to avoid polluting test output
    console.error = jest.fn();
  });
  
  test('should handle ApiError with correct status code and message', () => {
    // Create a custom API error
    const apiError = new ApiError(404, 'Resource not found');
    
    // Call the error handler with the API error
    errorHandler(apiError, req as Request, res as Response, next);
    
    // Verify error was logged
    expect(console.error).toHaveBeenCalled();
    
    // Verify response was sent with correct status and message
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Resource not found'
    });
  });
  
  test('should handle standard Error with 500 status', () => {
    // Create a standard error
    const standardError = new Error('Something went wrong');
    
    // Call the error handler with the standard error
    errorHandler(standardError, req as Request, res as Response, next);
    
    // Verify error was logged
    expect(console.error).toHaveBeenCalled();
    
    // Verify response was sent with 500 status
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Internal Server Error'
    });
  });
  
  test('should create ApiError with correct properties', () => {
    const error = new ApiError(400, 'Bad Request');
    
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe('Bad Request');
    expect(error.name).toBe('ApiError');
  });
}); 