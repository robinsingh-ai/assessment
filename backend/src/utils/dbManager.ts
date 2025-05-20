import fs from 'fs';
import path from 'path';
import { Book } from '../models/Book';

const DB_FILE_PATH = path.join(__dirname, '../../data/books.json');

/**
 * Singleton Database Manager
 * Handles data persistence with JSON file
 */
export class DbManager {
  private static instance: DbManager;
  private books: Book[] = [];
  
  /**
   * Private constructor to enforce singleton pattern
   */
  private constructor() {
    this.init();
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): DbManager {
    if (!DbManager.instance) {
      DbManager.instance = new DbManager();
    }
    return DbManager.instance;
  }

  /**
   * Initialize the database
   * Creates the data directory and file if they don't exist
   * Loads data from the JSON file into memory
   */
  private init(): void {
    try {
      // Create the data directory if it doesn't exist
      const dataDir = path.dirname(DB_FILE_PATH);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      // Create the file if it doesn't exist
      if (!fs.existsSync(DB_FILE_PATH)) {
        // Initialize with sample data
        const initialBooks: Book[] = [
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
          },
          {
            id: '3',
            isbn: '9780743273565',
            title: 'The Great Gatsby',
            author: 'F. Scott Fitzgerald',
            yearPublished: 1925,
            genre: 'Classic'
          }
        ];
        
        fs.writeFileSync(DB_FILE_PATH, JSON.stringify(initialBooks, null, 2));
        this.books = initialBooks;
      } else {
        // Load existing data
        const data = fs.readFileSync(DB_FILE_PATH, 'utf8');
        this.books = JSON.parse(data);
      }

      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
      // If there's an error, start with an empty array
      this.books = [];
    }
  }

  /**
   * Save data to the JSON file
   */
  private saveToFile(): void {
    try {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(this.books, null, 2));
    } catch (error) {
      console.error('Error saving to database file:', error);
    }
  }

  /**
   * Get all books
   */
  public getAllBooks(): Book[] {
    return [...this.books]; // Return a copy to prevent direct modification
  }

  /**
   * Get a book by ID
   */
  public getBookById(id: string): Book | undefined {
    return this.books.find(book => book.id === id);
  }

  /**
   * Get a book by ISBN
   */
  public getBookByISBN(isbn: string): Book | undefined {
    return this.books.find(book => book.isbn === isbn);
  }

  /**
   * Check if a book with the given ISBN already exists
   */
  public isbnExists(isbn: string): boolean {
    return this.books.some(book => book.isbn === isbn);
  }

  /**
   * Add a new book
   */
  public addBook(bookData: Omit<Book, 'id'>): Book {
    const newBook: Book = {
      ...bookData,
      id: Date.now().toString()
    };
    
    this.books.push(newBook);
    this.saveToFile();
    
    return newBook;
  }

  /**
   * Update a book
   */
  public updateBook(id: string, bookData: Omit<Book, 'id'>): Book | null {
    const bookIndex = this.books.findIndex(book => book.id === id);
    
    if (bookIndex === -1) {
      return null;
    }
    
    // Check if ISBN is being changed and if it would conflict with another book
    if (bookData.isbn !== this.books[bookIndex].isbn) {
      const isbnExists = this.books.some(
        (book, index) => index !== bookIndex && book.isbn === bookData.isbn
      );
      
      if (isbnExists) {
        return null;
      }
    }
    
    const updatedBook: Book = {
      ...bookData,
      id
    };
    
    this.books[bookIndex] = updatedBook;
    this.saveToFile();
    
    return updatedBook;
  }

  /**
   * Delete a book
   */
  public deleteBook(id: string): boolean {
    const initialLength = this.books.length;
    
    this.books = this.books.filter(book => book.id !== id);
    
    // If the length is different, it means we removed a book
    if (this.books.length !== initialLength) {
      this.saveToFile();
      return true;
    }
    
    return false;
  }
} 