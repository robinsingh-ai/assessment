import { Book } from '../types';

const API_URL = 'http://localhost:5001/books';

/**
 * API service for book operations
 */
export const BookAPI = {
  /**
   * Get all books
   */
  async getAllBooks(): Promise<Book[]> {
    try {
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
  },

  /**
   * Get a book by ID
   */
  async getBookById(id: string): Promise<Book> {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching book ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new book
   */
  async createBook(book: Omit<Book, 'id'>): Promise<Book> {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(book),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating book:', error);
      throw error;
    }
  },

  /**
   * Update a book
   */
  async updateBook(id: string, book: Omit<Book, 'id'>): Promise<Book> {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(book),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error updating book ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a book
   */
  async deleteBook(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error deleting book ${id}:`, error);
      throw error;
    }
  },
}; 