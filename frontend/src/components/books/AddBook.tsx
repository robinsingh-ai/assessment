import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book } from '../../types';
import { useBookStore } from '../../store/bookStore';
import PageContainer from '../layout/PageContainer';
import FormContainer from '../forms/FormContainer';
import InputField from '../forms/InputField';
import FormActions from '../forms/FormActions';
import FormInstructions from '../forms/FormInstructions';
import './AddBook.css';

const AddBook: React.FC = () => {
  const navigate = useNavigate();
  const { addBook } = useBookStore();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  
  const [bookData, setBookData] = useState<Omit<Book, 'id'>>({
    isbn: '',
    title: '',
    author: '',
    yearPublished: new Date().getFullYear(),
    genre: ''
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof Omit<Book, 'id'>, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Omit<Book, 'id'>, boolean>>>({});

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
    
    // Validate all fields
    (Object.keys(bookData) as Array<keyof Omit<Book, 'id'>>).forEach(field => {
      const error = validateField(field, bookData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    // Mark all fields as touched when submitting
    const allTouched = Object.keys(bookData).reduce((acc, key) => {
      acc[key as keyof Omit<Book, 'id'>] = true;
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
    
    if (validateForm()) {
      try {
        setLoading(true);
        setApiError(null);
        
        // Clean ISBN before submitting
        const bookWithCleanISBN = {
          ...bookData,
          isbn: bookData.isbn.replace(/[-\s]/g, '')
        };
        
        await addBook(bookWithCleanISBN);
        navigate('/');
      } catch (error) {
        console.error('Error adding book:', error);
        setApiError(error instanceof Error ? error.message : 'Failed to add book');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <PageContainer title="Add New Book">
      <FormContainer 
        onSubmit={handleSubmit}
        instructions={
          <FormInstructions>
            Please fill in all fields to add a new book to the library
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
          submitText={loading ? "Adding..." : "Add Book"}
        />
      </FormContainer>
    </PageContainer>
  );
};

export default AddBook; 