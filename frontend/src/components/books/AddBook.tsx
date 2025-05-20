import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book } from '../../types';
import { useBookStore } from '../../store/bookStore';
import PageContainer from '../layout/PageContainer';
import FormContainer from '../forms/FormContainer';
import InputField from '../forms/InputField';
import FormActions from '../forms/FormActions';
import './AddBook.css';

const AddBook: React.FC = () => {
  const navigate = useNavigate();
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
      navigate('/');
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <PageContainer title="Add New Book">
      <FormContainer onSubmit={handleSubmit}>
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
          submitText="Add Book"
        />
      </FormContainer>
    </PageContainer>
  );
};

export default AddBook; 