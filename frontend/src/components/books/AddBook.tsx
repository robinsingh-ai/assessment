import React, { useState } from 'react';
import { Book } from '../../types';
import { useBookStore } from '../../store/bookStore';
import './AddBook.css';

const AddBook: React.FC = () => {
  const { addBook } = useBookStore();
  
  const [bookData, setBookData] = useState<Omit<Book, 'id'>>({
    title: '',
    author: '',
    yearPublished: new Date().getFullYear(),
    genre: ''
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof Omit<Book, 'id'>, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Omit<Book, 'id'>, string>> = {};
    
    if (!bookData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!bookData.author.trim()) {
      newErrors.author = 'Author is required';
    }
    
    const year = bookData.yearPublished;
    if (isNaN(year) || year < 1000 || year > new Date().getFullYear()) {
      newErrors.yearPublished = 'Please enter a valid year';
    }
    
    if (!bookData.genre.trim()) {
      newErrors.genre = 'Genre is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookData(prev => ({
      ...prev,
      [name]: name === 'yearPublished' ? parseInt(value, 10) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      addBook(bookData);
      // After adding, redirect to home page
      window.location.href = '/';
    }
  };

  return (
    <div className="add-book-container">
      <h1>Add New Book</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={bookData.title}
            onChange={handleChange}
          />
          {errors.title && <span className="error">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="author">Author</label>
          <input
            type="text"
            id="author"
            name="author"
            value={bookData.author}
            onChange={handleChange}
          />
          {errors.author && <span className="error">{errors.author}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="yearPublished">Year Published</label>
          <input
            type="number"
            id="yearPublished"
            name="yearPublished"
            value={bookData.yearPublished}
            onChange={handleChange}
            min="1000"
            max={new Date().getFullYear()}
          />
          {errors.yearPublished && <span className="error">{errors.yearPublished}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="genre">Genre</label>
          <input
            type="text"
            id="genre"
            name="genre"
            value={bookData.genre}
            onChange={handleChange}
          />
          {errors.genre && <span className="error">{errors.genre}</span>}
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => window.location.href = '/'}>Cancel</button>
          <button type="submit">Add Book</button>
        </div>
      </form>
    </div>
  );
};

export default AddBook; 