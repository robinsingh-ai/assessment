import { useState } from 'react';
import { Book } from '../types';

// Validation rules for book form fields
export const validateBookField = (name: keyof Omit<Book, 'id'>, value: string | number): string => {
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

interface UseBookFormProps {
  initialData?: Partial<Book>;
  onSubmit: (bookData: Omit<Book, 'id'>) => Promise<void>;
}

export const useBookForm = ({ initialData, onSubmit }: UseBookFormProps) => {
  const [bookData, setBookData] = useState<Omit<Book, 'id'>>({
    isbn: initialData?.isbn || '',
    title: initialData?.title || '',
    author: initialData?.author || '',
    yearPublished: initialData?.yearPublished || new Date().getFullYear(),
    genre: initialData?.genre || ''
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof Omit<Book, 'id'>, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Omit<Book, 'id'>, boolean>>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Omit<Book, 'id'>, string>> = {};
    let isValid = true;
    
    // Validate all fields
    (Object.keys(bookData) as Array<keyof Omit<Book, 'id'>>).forEach(field => {
      const error = validateBookField(field, bookData[field]);
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
      const error = validateBookField(typedName, typedName === 'yearPublished' ? parseInt(value, 10) || '' : value);
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
    const error = validateBookField(typedName, typedName === 'yearPublished' ? parseInt(value, 10) || '' : value);
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
        
        await onSubmit(bookWithCleanISBN);
      } catch (error) {
        console.error('Error submitting book:', error);
        setApiError(error instanceof Error ? error.message : 'Failed to submit book');
        setLoading(false);
      }
    }
  };

  return {
    bookData,
    errors,
    touched,
    loading,
    apiError,
    setApiError,
    handleChange,
    handleBlur,
    handleSubmit,
    setLoading
  };
}; 