import { Request, Response } from 'express';
import { BookService } from '../services/bookService';
import { Book } from '../models/Book';

const bookService = new BookService();

// Get all books
export const getAllBooks = (req: Request, res: Response): void => {
  try {
    const books = bookService.getAllBooks();
    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

