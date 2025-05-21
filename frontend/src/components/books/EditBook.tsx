import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Book } from '../../types';
import { useBookStore } from '../../store/bookStore';
import PageContainer from '../layout/PageContainer';
import FormContainer from '../forms/FormContainer';
import InputField from '../forms/InputField';
import FormActions from '../forms/FormActions';
import FormInstructions from '../forms/FormInstructions';
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
  const [touched, setTouched] = useState<Partial<Record<keyof Omit<Book, 'id'>, boolean>>>({});
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

  const validateField = (name: keyof Omit<Book, 'id'>, value: string | number): string => {
    switch (name) {
      case 'isbn': {
        const cleanedISBN = String(value).replace(/[-\s]/g, '');
        if (!cleanedISBN) return 'ISBN is required';
        if (!/^\d{13}$/.test(cleanedISBN)) return 'Please enter a valid 13-digit ISBN';
        return '';
      }
      case 'title':
        return !value || String(value).trim() === '' ? 'Title is required' : '';
      case 'author':
        return !value || String(value).trim() === '' ? 'Author is required' : '';
      case 'yearPublished': {
        const year = Number(value);
        if (isNaN(year)) return 'Year must be a number';
        if (year < 1000) return 'Year must be at least 1000';
        if (year > new Date().getFullYear()) return 'Year cannot be in the future';
        return '';
      }
      case 'genre':
        return !value || String(value).trim() === '' ? 'Genre is required' : '';
      default:
        return '';
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Omit<Book, 'id'>, string>> = {};
    let isValid = true;
    
    // Validate specific fields we care about
    const fieldsToValidate: Array<keyof Omit<Book, 'id'>> = ['isbn', 'title', 'author', 'yearPublished', 'genre'];
    
    fieldsToValidate.forEach(field => {
      const error = validateField(field, bookData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    
    // Mark all fields as touched when submitting
    const allTouched = fieldsToValidate.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {} as Partial<Record<keyof Omit<Book, 'id'>, boolean>>);
    
    setTouched(allTouched);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const typedName = name as keyof Omit<Book, 'id'>;
    
    setBookData(prev => ({
      ...prev,
      [name]: typedName === 'yearPublished' ? parseInt(value, 10) || '' : value
    }));
    
    // If field has been touched, validate on change
    if (touched[typedName]) {
      const error = validateField(typedName, typedName === 'yearPublished' ? parseInt(value, 10) || '' : value);
      setErrors(prev => ({
        ...prev,
        [typedName]: error
      }));
    }
    
    // Clear API error when user makes changes
    if (apiError) {
      setApiError(null);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const typedName = name as keyof Omit<Book, 'id'>;
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [typedName]: true
    }));
    
    // Validate the field
    const error = validateField(typedName, typedName === 'yearPublished' ? parseInt(value, 10) || '' : value);
    setErrors(prev => ({
      ...prev,
      [typedName]: error
    }));
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
      <FormContainer 
        onSubmit={handleSubmit}
        instructions={
          <FormInstructions>
            Update the book details below
          </FormInstructions>
        }
      >
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
          onBlur={handleBlur}
          error={touched.isbn ? errors.isbn : undefined}
          required
          placeholder="Enter 13-digit ISBN (e.g., 978-3-16-148410-0)"
          description="The International Standard Book Number is a 13-digit unique identifier"
        />

        <InputField
          id="title"
          name="title"
          label="Title"
          value={bookData.title}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.title ? errors.title : undefined}
          required
          placeholder="Enter book title"
        />

        <InputField
          id="author"
          name="author"
          label="Author"
          value={bookData.author}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.author ? errors.author : undefined}
          required
          placeholder="Enter author name"
          description="Enter the full name of the primary author"
        />

        <InputField
          id="yearPublished"
          name="yearPublished"
          label="Year Published"
          value={bookData.yearPublished}
          onChange={handleChange}
          onBlur={handleBlur}
          type="number"
          min={1000}
          max={new Date().getFullYear()}
          error={touched.yearPublished ? errors.yearPublished : undefined}
          required
          placeholder="Enter publication year"
          description={`The year must be between 1000 and ${new Date().getFullYear()}`}
        />

        <InputField
          id="genre"
          name="genre"
          label="Genre"
          value={bookData.genre}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.genre ? errors.genre : undefined}
          required
          placeholder="Enter book genre"
          description="E.g., Fiction, Science Fiction, History, Biography"
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