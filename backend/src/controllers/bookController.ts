import { Request, Response, NextFunction } from 'express';
import { BookService } from '../services/bookService';
import { Book } from '../models/Book';
import { ApiError } from '../middleware/errorHandler';

// Export the service for testing purposes
export const bookService = new BookService();

// Get all books
export const getAllBooks = (req: Request, res: Response, next: NextFunction, serviceInstance = bookService): void => {
  try {
    const books = serviceInstance.getAllBooks();
    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
};

// Get a book by id
export const getBookById = (req: Request, res: Response, next: NextFunction, serviceInstance = bookService): void => {
  try {
    const { id } = req.params;
    const book = serviceInstance.getBookById(id);
    
    if (!book) {
      throw new ApiError(404, 'Book not found');
    }
    
    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
};

// Create a new book
export const createBook = (req: Request, res: Response, next: NextFunction, serviceInstance = bookService): void => {
  try {
    const bookData: Omit<Book, 'id'> = req.body;
    const newBook = serviceInstance.createBook(bookData);
    res.status(201).json(newBook);
  } catch (error) {
    next(error);
  }
};

// Update a book
export const updateBook = (req: Request, res: Response, next: NextFunction, serviceInstance = bookService): void => {
  try {
    const { id } = req.params;
    const bookData: Omit<Book, 'id'> = req.body;
    
    const updatedBook = serviceInstance.updateBook(id, bookData);
    
    if (!updatedBook) {
      throw new ApiError(404, 'Book not found');
    }
    
    res.status(200).json(updatedBook);
  } catch (error) {
    next(error);
  }
};

// Delete a book
export const deleteBook = (req: Request, res: Response, next: NextFunction, serviceInstance = bookService): void => {
  try {
    const { id } = req.params;
    const deleted = serviceInstance.deleteBook(id);
    
    if (!deleted) {
      throw new ApiError(404, 'Book not found');
    }
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}; 