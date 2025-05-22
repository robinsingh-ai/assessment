import { BookService } from '../services/bookService';
import { DbManager } from '../utils/dbManager';
import { Book } from '../models/Book';

// Mock the DbManager
jest.mock('../utils/dbManager', () => {
  return {
    DbManager: {
      getInstance: jest.fn().mockReturnValue({
        getAllBooks: jest.fn(),
        getBookById: jest.fn(),
        addBook: jest.fn(),
        updateBook: jest.fn(),
        deleteBook: jest.fn()
      })
    }
  };
});

describe('BookService', () => {
  let bookService: BookService;
  let dbManagerMock: {
    getAllBooks: jest.Mock;
    getBookById: jest.Mock;
    addBook: jest.Mock;
    updateBook: jest.Mock;
    deleteBook: jest.Mock;
  };
  
  const mockBooks: Book[] = [
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
    }
  ];
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Get the mocked DbManager instance
    dbManagerMock = DbManager.getInstance() as any;
    
    // Create a new BookService instance for each test
    bookService = new BookService();
  });
  
  test('getAllBooks should return all books from the database', () => {
    // Setup mock to return books
    dbManagerMock.getAllBooks.mockReturnValue(mockBooks);
    
    // Call the service method
    const result = bookService.getAllBooks();
    
    // Verify DbManager method was called
    expect(dbManagerMock.getAllBooks).toHaveBeenCalled();
    
    // Verify result matches mock data
    expect(result).toEqual(mockBooks);
  });
  
  test('getBookById should return a specific book from the database', () => {
    // Setup mock to return a specific book
    dbManagerMock.getBookById.mockReturnValue(mockBooks[0]);
    
    // Call the service method
    const result = bookService.getBookById('1');
    
    // Verify DbManager method was called with correct ID
    expect(dbManagerMock.getBookById).toHaveBeenCalledWith('1');
    
    // Verify result matches mock data
    expect(result).toEqual(mockBooks[0]);
  });
  
  test('getBookById should return undefined for non-existent book', () => {
    // Setup mock to return undefined
    dbManagerMock.getBookById.mockReturnValue(undefined);
    
    // Call the service method
    const result = bookService.getBookById('999');
    
    // Verify DbManager method was called with correct ID
    expect(dbManagerMock.getBookById).toHaveBeenCalledWith('999');
    
    // Verify result is undefined
    expect(result).toBeUndefined();
  });
  
  test('createBook should add a new book to the database', () => {
    // New book data
    const newBookData = {
      isbn: '9781234567897',
      title: 'Test Book',
      author: 'Test Author',
      yearPublished: 2020,
      genre: 'Test'
    };
    
    // Expected result with ID
    const expectedResult = {
      id: '123',
      ...newBookData
    };
    
    // Setup mock to return the new book with ID
    dbManagerMock.addBook.mockReturnValue(expectedResult);
    
    // Call the service method
    const result = bookService.createBook(newBookData);
    
    // Verify DbManager method was called with correct data
    expect(dbManagerMock.addBook).toHaveBeenCalledWith(newBookData);
    
    // Verify result matches expected
    expect(result).toEqual(expectedResult);
  });
  
  test('updateBook should update an existing book in the database', () => {
    // Book update data
    const bookUpdateData = {
      isbn: '9780061120084',
      title: 'Updated Title',
      author: 'Harper Lee',
      yearPublished: 1960,
      genre: 'Fiction'
    };
    
    // Expected result
    const expectedResult = {
      id: '1',
      ...bookUpdateData
    };
    
    // Setup mock to return the updated book
    dbManagerMock.updateBook.mockReturnValue(expectedResult);
    
    // Call the service method
    const result = bookService.updateBook('1', bookUpdateData);
    
    // Verify DbManager method was called with correct data
    expect(dbManagerMock.updateBook).toHaveBeenCalledWith('1', bookUpdateData);
    
    // Verify result matches expected
    expect(result).toEqual(expectedResult);
  });
  
  test('updateBook should return null for non-existent book', () => {
    // Book update data
    const bookUpdateData = {
      isbn: '9781234567897',
      title: 'Test Book',
      author: 'Test Author',
      yearPublished: 2020,
      genre: 'Test'
    };
    
    // Setup mock to return null
    dbManagerMock.updateBook.mockReturnValue(null);
    
    // Call the service method
    const result = bookService.updateBook('999', bookUpdateData);
    
    // Verify DbManager method was called with correct data
    expect(dbManagerMock.updateBook).toHaveBeenCalledWith('999', bookUpdateData);
    
    // Verify result is null
    expect(result).toBeNull();
  });
  
  test('deleteBook should delete a book from the database', () => {
    // Setup mock to return true
    dbManagerMock.deleteBook.mockReturnValue(true);
    
    // Call the service method
    const result = bookService.deleteBook('1');
    
    // Verify DbManager method was called with correct ID
    expect(dbManagerMock.deleteBook).toHaveBeenCalledWith('1');
    
    // Verify result is true
    expect(result).toBe(true);
  });
  
  test('deleteBook should return false for non-existent book', () => {
    // Setup mock to return false
    dbManagerMock.deleteBook.mockReturnValue(false);
    
    // Call the service method
    const result = bookService.deleteBook('999');
    
    // Verify DbManager method was called with correct ID
    expect(dbManagerMock.deleteBook).toHaveBeenCalledWith('999');
    
    // Verify result is false
    expect(result).toBe(false);
  });
}); 