import { Request, Response, NextFunction } from 'express';
import { ApiError } from './errorHandler';
import { DbManager } from '../utils/dbManager';

// Get the database instance
const dbManager = DbManager.getInstance();

/**
 * Validates ISBN format
 * @param isbn ISBN string to validate
 * @returns true if valid, false otherwise
 */
const isValidISBN = (isbn: string): boolean => {
  // Remove hyphens and spaces
  const cleanedISBN = isbn.replace(/[-\s]/g, '');
  
  // Check if it's a 13-digit number
  if (!/^\d{13}$/.test(cleanedISBN)) {
    return false;
  }
  
  // ISBN-13 check digit validation
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleanedISBN[i]) * (i % 2 === 0 ? 1 : 3);
  }
  
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === parseInt(cleanedISBN[12]);
};

/**
 * Validates book data for creation and updates
 */
export const validateBookData = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { isbn, title, author, yearPublished, genre } = req.body;
    
    // Validate ISBN
    if (!isbn || typeof isbn !== 'string') {
      throw new ApiError(400, 'ISBN is required and must be a string');
    }
    
    // Clean the ISBN (remove hyphens and spaces)
    const cleanedISBN = isbn.replace(/[-\s]/g, '');
    req.body.isbn = cleanedISBN; // Replace with cleaned version
    
    if (!isValidISBN(cleanedISBN)) {
      throw new ApiError(400, 'Invalid ISBN-13 format');
    }
    
    // Check required fields
    if (!title || typeof title !== 'string' || title.trim() === '') {
      throw new ApiError(400, 'Title is required and must be a non-empty string');
    }
    
    if (!author || typeof author !== 'string' || author.trim() === '') {
      throw new ApiError(400, 'Author is required and must be a non-empty string');
    }
    
    if (!genre || typeof genre !== 'string' || genre.trim() === '') {
      throw new ApiError(400, 'Genre is required and must be a non-empty string');
    }
    
    // Validate year published
    const currentYear = new Date().getFullYear();
    
    if (!yearPublished || 
        typeof yearPublished !== 'number' || 
        isNaN(yearPublished) || 
        yearPublished < 1000 || 
        yearPublished > currentYear) {
      throw new ApiError(400, `Year published must be a valid year between 1000 and ${currentYear}`);
    }
    
    // If everything is valid, continue
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Validates book ID parameter
 */
export const validateBookId = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new ApiError(400, 'Valid book ID is required');
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Checks for duplicate ISBN when creating a new book
 */
export const checkDuplicateISBN = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { isbn } = req.body;
    
    // Check if book with this ISBN already exists
    if (dbManager.isbnExists(isbn)) {
      throw new ApiError(409, `Book with ISBN ${isbn} already exists`);
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Checks for duplicate ISBN when updating a book
 * Allows the same ISBN if it belongs to the book being updated
 */
export const checkDuplicateISBNOnUpdate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { isbn } = req.body;
    
    // Get the current book
    const currentBook = dbManager.getBookById(id);
    
    // If book not found, let the controller handle it
    if (!currentBook) {
      return next();
    }
    
    // If ISBN is unchanged, no need to check for duplicates
    if (currentBook.isbn === isbn) {
      return next();
    }
    
    // Check if another book has this ISBN
    if (dbManager.isbnExists(isbn)) {
      throw new ApiError(409, `Another book with ISBN ${isbn} already exists`);
    }
    
    next();
  } catch (error) {
    next(error);
  }
}; 