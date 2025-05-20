import { Request, Response, NextFunction } from 'express';
import { BookService } from '../services/bookService';
import { Book } from '../models/Book';
import { ApiError } from '../middleware/errorHandler';

const bookService = new BookService();

// Get all books
export const getAllBooks = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const books = bookService.getAllBooks();
    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
};

// Get a book by id
export const getBookById = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { id } = req.params;
    const book = bookService.getBookById(id);
    
    if (!book) {
      throw new ApiError(404, 'Book not found');
    }
    
    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
};

// Create a new book
export const createBook = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const bookData: Omit<Book, 'id'> = req.body;
    const newBook = bookService.createBook(bookData);
    res.status(201).json(newBook);
  } catch (error) {
    next(error);
  }
};

// Update a book
export const updateBook = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { id } = req.params;
    const bookData: Omit<Book, 'id'> = req.body;
    
    const updatedBook = bookService.updateBook(id, bookData);
    
    if (!updatedBook) {
      throw new ApiError(404, 'Book not found');
    }
    
    res.status(200).json(updatedBook);
  } catch (error) {
    next(error);
  }
};

// Delete a book
export const deleteBook = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { id } = req.params;
    const deleted = bookService.deleteBook(id);
    
    if (!deleted) {
      throw new ApiError(404, 'Book not found');
    }
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}; 