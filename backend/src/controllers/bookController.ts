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

// Get a book by id
export const getBookById = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const book = bookService.getBookById(id);
    
    if (!book) {
      res.status(404).json({ error: 'Book not found' });
      return;
    }
    
    res.status(200).json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new book
export const createBook = (req: Request, res: Response): void => {
  try {
    const bookData: Omit<Book, 'id'> = req.body;
    
    // Validate required fields
    if (!bookData.title || !bookData.author || !bookData.genre) {
      res.status(400).json({ error: 'Title, author, and genre are required fields' });
      return;
    }
    
    // Validate year published
    if (
      !bookData.yearPublished || 
      isNaN(bookData.yearPublished) || 
      bookData.yearPublished < 1000 || 
      bookData.yearPublished > new Date().getFullYear()
    ) {
      res.status(400).json({ error: 'Invalid year published' });
      return;
    }
    
    const newBook = bookService.createBook(bookData);
    res.status(201).json(newBook);
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a book
export const updateBook = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const bookData: Omit<Book, 'id'> = req.body;
    
    // Validate required fields
    if (!bookData.title || !bookData.author || !bookData.genre) {
      res.status(400).json({ error: 'Title, author, and genre are required fields' });
      return;
    }
    
    // Validate year published
    if (
      !bookData.yearPublished || 
      isNaN(bookData.yearPublished) || 
      bookData.yearPublished < 1000 || 
      bookData.yearPublished > new Date().getFullYear()
    ) {
      res.status(400).json({ error: 'Invalid year published' });
      return;
    }
    
    const updatedBook = bookService.updateBook(id, bookData);
    
    if (!updatedBook) {
      res.status(404).json({ error: 'Book not found' });
      return;
    }
    
    res.status(200).json(updatedBook);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a book
export const deleteBook = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const deleted = bookService.deleteBook(id);
    
    if (!deleted) {
      res.status(404).json({ error: 'Book not found' });
      return;
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 