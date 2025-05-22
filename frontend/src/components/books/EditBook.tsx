import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBookStore } from '../../store/bookStore';
import PageContainer from '../layout/PageContainer';
import BookForm from './BookForm';
import { useBookForm } from '../../hooks/useBookForm';
import { useBookData } from '../../hooks/useBookData';
import './EditBook.css';

const EditBook: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateBook } = useBookStore();
  const { book, loading: initialLoading, notFound } = useBookData({ id });
  
  const {
    bookData,
    errors,
    touched,
    loading,
    apiError,
    handleChange,
    handleBlur,
    handleSubmit,
    setApiError
  } = useBookForm({
    initialData: book,
    onSubmit: async (bookData) => {
      if (!id) {
        throw new Error('Book ID is missing');
      }
      await updateBook(id, bookData);
      navigate('/');
    }
  });

  const handleCancel = () => {
    navigate('/');
  };

  if (initialLoading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (notFound || (apiError && !book)) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{apiError || 'Book not found'}</p>
        <button onClick={() => navigate('/')}>Back to Book List</button>
      </div>
    );
  }

  return (
    <PageContainer title="Edit Book">
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
        submitText="Update Book"
        instructions="Update the book details below"
      />
    </PageContainer>
  );
};

export default EditBook; 