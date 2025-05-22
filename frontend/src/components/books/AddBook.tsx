import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookStore } from '../../store/bookStore';
import PageContainer from '../layout/PageContainer';
import BookForm from './BookForm';
import { useBookForm } from '../../hooks/useBookForm';
import './AddBook.css';

const AddBook: React.FC = () => {
  const navigate = useNavigate();
  const { addBook } = useBookStore();
  
  const {
    bookData,
    errors,
    touched,
    loading,
    apiError,
    handleChange,
    handleBlur,
    handleSubmit,
    setLoading
  } = useBookForm({
    onSubmit: async (bookData) => {
      await addBook(bookData);
      navigate('/');
    }
  });

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <PageContainer title="Add New Book">
      <BookForm
        bookData={bookData}
        errors={errors}
        touched={touched}
        loading={loading}
        apiError={apiError}
        handleChange={handleChange}
        handleBlur={handleBlur}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
        submitText="Add Book"
        instructions="Please fill in all fields to add a new book to the library"
      />
    </PageContainer>
  );
};

export default AddBook; 