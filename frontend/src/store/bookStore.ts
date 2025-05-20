import { create } from 'zustand';
import  Book  from '../types';

interface BookState {
  books: Book[];
  addBook: (book: Omit<Book, 'id'>) => void;
  updateBook: (id: string, updatedBook: Omit<Book, 'id'>) => void;
  deleteBook: (id: string) => void;
  getBook: (id: string) => Book | undefined;
}

// Initial sample data
const initialBooks: Book[] = [
  {
    id: '1',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    yearPublished: 1960,
    genre: 'Fiction'
  },
  {
    id: '2',
    title: '1984',
    author: 'George Orwell',
    yearPublished: 1949,
    genre: 'Dystopian'
  },
  {
    id: '3',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    yearPublished: 1925,
    genre: 'Classic'
  }
];

export const useBookStore = create<BookState>((set, get) => ({
  books: initialBooks,
  
  addBook: (book) => set((state) => {
    const newId = Date.now().toString();
    const newBook: Book = { ...book, id: newId };
    return { books: [...state.books, newBook] };
  }),
  
  updateBook: (id, updatedBook) => set((state) => ({
    books: state.books.map(book => 
      book.id === id ? { ...updatedBook, id } : book
    )
  })),
  
  deleteBook: (id) => set((state) => ({
    books: state.books.filter(book => book.id !== id)
  })),
  
  getBook: (id) => {
    return get().books.find(book => book.id === id);
  }
})); 