import { Request, Response, NextFunction } from 'express';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  statusCode: number;
  
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handling middleware
 * Catches all errors and sends appropriate responses
 */
export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);
  
  // If it's our ApiError, use its status code and message
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: err.message
    });
  }
  
  // For unhandled errors
  return res.status(500).json({
    error: 'Internal Server Error'
  });
}; 