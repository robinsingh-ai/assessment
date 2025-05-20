import { Book, books } from '../models/Book';

// Class to handle business logic for books
export class BookService {
  // Get all books
  getAllBooks(): Book[] {
    return books;
  }

}

  