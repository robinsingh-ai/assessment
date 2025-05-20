import { Book, books } from '../models/Book';

// Class to handle business logic for books
export class BookService {
  // Get all books
  getAllBooks(): Book[] {
    return books;
  }

  // Get a book by id
  getBookById(id: string): Book | undefined {
    return books.find(book => book.id === id);
  }

  // Create a new book
  createBook(bookData: Omit<Book, 'id'>): Book {
    const newBook: Book = {
      ...bookData,
      id: Date.now().toString()
    };
    
    books.push(newBook);
    return newBook;
  }

  // Update a book
  updateBook(id: string, bookData: Omit<Book, 'id'>): Book | null {
    const bookIndex = books.findIndex(book => book.id === id);
    
    if (bookIndex === -1) {
      return null;
    }
    
    const updatedBook: Book = {
      ...bookData,
      id
    };
    
    books[bookIndex] = updatedBook;
    return updatedBook;
  }

  // Delete a book
  deleteBook(id: string): boolean {
    const initialLength = books.length;
    
    const filteredBooks = books.filter(book => book.id !== id);
    
    // If the length is different, it means we removed a book
    if (filteredBooks.length !== initialLength) {
      // Replace the original array with the filtered one
      books.length = 0;
      books.push(...filteredBooks);
      return true;
    }
    
    return false;
  }
} 