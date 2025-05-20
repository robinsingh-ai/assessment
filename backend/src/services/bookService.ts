import { Book } from '../models/Book';
import { DbManager } from '../utils/dbManager';

/**
 * Service for book operations
 * Uses DbManager singleton for data persistence
 */
export class BookService {
  private db: DbManager;
  
  constructor() {
    // Get the singleton instance of DbManager
    this.db = DbManager.getInstance();
  }

  /**
   * Get all books
   */
  getAllBooks(): Book[] {
    return this.db.getAllBooks();
  }

  /**
   * Get a book by id
   */
  getBookById(id: string): Book | undefined {
    return this.db.getBookById(id);
  }

  /**
   * Create a new book
   */
  createBook(bookData: Omit<Book, 'id'>): Book {
    return this.db.addBook(bookData);
  }

  /**
   * Update a book
   */
  updateBook(id: string, bookData: Omit<Book, 'id'>): Book | null {
    return this.db.updateBook(id, bookData);
  }

  /**
   * Delete a book
   */
  deleteBook(id: string): boolean {
    return this.db.deleteBook(id);
  }
} 