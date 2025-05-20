import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Book } from '../../types';
import { useBookStore } from '../../store/bookStore';
import './EditBook.css';

const EditBook: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getBook, updateBook } = useBookStore();
  
  const [bookData, setBookData] = useState<Book>({
    id: '',
    title: '',
    author: '',
    yearPublished: new Date().getFullYear(),
    genre: ''
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof Omit<Book, 'id'>, string>>>({});
  const [loading, setLoading] = useState(true);

  // Fetch book data from store
  useEffect(() => {
    if (id) {
      const book = getBook(id);
      
      if (book) {
        setBookData(book);
      } else {
        alert('Book not found');
        window.location.href = '/';
      }
    }
    
    setLoading(false);
  }, [id, getBook]);

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
    
    if (validateForm() && id) {
      updateBook(id, {
        title: bookData.title,
        author: bookData.author,
        yearPublished: bookData.yearPublished,
        genre: bookData.genre
      });
      // After editing, redirect to home page
      window.location.href = '/';
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="edit-book-container">
      <h1>Edit Book</h1>
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
          <button type="submit">Update Book</button>
        </div>
      </form>
    </div>
  );
};

export default EditBook; 