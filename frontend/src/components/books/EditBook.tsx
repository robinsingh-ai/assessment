import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Book } from '../../types';
import { useBookStore } from '../../store/bookStore';
import PageContainer from '../layout/PageContainer';
import FormContainer from '../forms/FormContainer';
import InputField from '../forms/InputField';
import FormActions from '../forms/FormActions';
import './EditBook.css';

const EditBook: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { books, fetchBooks, updateBook } = useBookStore();
  
  const [bookData, setBookData] = useState<Book>({
    id: '',
    isbn: '',
    title: '',
    author: '',
    yearPublished: new Date().getFullYear(),
    genre: ''
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof Omit<Book, 'id'>, string>>>({});
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Fetch books if not already loaded
  useEffect(() => {
    const loadData = async () => {
      if (books.length === 0) {
        await fetchBooks();
      }
      setLoading(false);
    };
    
    loadData();
  }, [books.length, fetchBooks]);

  // Set book data when books are loaded or id changes
  useEffect(() => {
    if (!loading && id && books.length > 0) {
      const book = books.find(book => book.id === id);
      
      if (book) {
        setBookData(book);
      } else {
        setApiError('Book not found');
      }
    }
  }, [id, books, loading]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Omit<Book, 'id'>, string>> = {};
    
    // Validate ISBN (13 digits, can contain hyphens for input)
    const cleanedISBN = bookData.isbn.replace(/[-\s]/g, '');
    if (!cleanedISBN || !/^\d{13}$/.test(cleanedISBN)) {
      newErrors.isbn = 'Please enter a valid 13-digit ISBN';
    }
    
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
    
    // Clear API error when user makes changes
    if (apiError) {
      setApiError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm() && id) {
      try {
        setSaving(true);
        setApiError(null);
        
        // Clean ISBN before submitting
        const bookWithCleanISBN = {
          isbn: bookData.isbn.replace(/[-\s]/g, ''),
          title: bookData.title,
          author: bookData.author,
          yearPublished: bookData.yearPublished,
          genre: bookData.genre
        };
        
        await updateBook(id, bookWithCleanISBN);
        navigate('/');
      } catch (error) {
        console.error('Error updating book:', error);
        setApiError(error instanceof Error ? error.message : 'Failed to update book');
      } finally {
        setSaving(false);
      }
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (apiError && !bookData.id) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{apiError}</p>
        <button onClick={() => navigate('/')}>Back to Book List</button>
      </div>
    );
  }

  return (
    <PageContainer title="Edit Book">
      <FormContainer onSubmit={handleSubmit}>
        {apiError && (
          <div className="api-error-message">
            {apiError}
          </div>
        )}
        
        <InputField
          id="isbn"
          name="isbn"
          label="ISBN (13-digit)"
          value={bookData.isbn}
          onChange={handleChange}
          error={errors.isbn}
          required
        />

        <InputField
          id="title"
          name="title"
          label="Title"
          value={bookData.title}
          onChange={handleChange}
          error={errors.title}
          required
        />

        <InputField
          id="author"
          name="author"
          label="Author"
          value={bookData.author}
          onChange={handleChange}
          error={errors.author}
          required
        />

        <InputField
          id="yearPublished"
          name="yearPublished"
          label="Year Published"
          value={bookData.yearPublished}
          onChange={handleChange}
          type="number"
          min={1000}
          max={new Date().getFullYear()}
          error={errors.yearPublished}
          required
        />

        <InputField
          id="genre"
          name="genre"
          label="Genre"
          value={bookData.genre}
          onChange={handleChange}
          error={errors.genre}
          required
        />

        <FormActions
          onCancel={handleCancel}
          submitText={saving ? "Saving..." : "Update Book"}
        />
      </FormContainer>
    </PageContainer>
  );
};

export default EditBook; 