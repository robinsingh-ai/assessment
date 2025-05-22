import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBookStore } from '../../store/bookStore';
import PageContainer from '../layout/PageContainer';
import BookForm from './BookForm';
import { useBookForm } from '../../hooks/useBookForm';
import './EditBook.css';

const EditBook: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { books, fetchBooks, updateBook } = useBookStore();
  const [initialLoading, setInitialLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  
  // Fetch books if not already loaded
  useEffect(() => {
    const loadData = async () => {
      if (books.length === 0) {
        await fetchBooks();
      }
      setInitialLoading(false);
    };
    
    loadData();
  }, [books.length, fetchBooks]);

  // Find the book to edit
  const bookToEdit = id ? books.find(book => book.id === id) : undefined;
  
  // Set not found state if book doesn't exist
  useEffect(() => {
    if (!initialLoading && id && books.length > 0 && !bookToEdit) {
      setNotFound(true);
    }
  }, [initialLoading, id, books, bookToEdit]);

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
    initialData: bookToEdit,
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

  if (notFound || (apiError && !bookToEdit)) {
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