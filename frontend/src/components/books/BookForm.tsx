import React from 'react';
import { Book } from '../../types';
import FormContainer from '../forms/FormContainer';
import FormInstructions from '../forms/FormInstructions';
import FormActions from '../forms/FormActions';
import BookFormFields from './BookFormFields';

interface BookFormProps {
  bookData: Omit<Book, 'id'>;
  errors: Partial<Record<keyof Omit<Book, 'id'>, string>>;
  touched: Partial<Record<keyof Omit<Book, 'id'>, boolean>>;
  loading: boolean;
  apiError: string | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleCancel: () => void;
  submitText: string;
  instructions: string;
}

const BookForm: React.FC<BookFormProps> = ({
  bookData,
  errors,
  touched,
  loading,
  apiError,
  handleChange,
  handleBlur,
  handleSubmit,
  handleCancel,
  submitText,
  instructions
}) => {
  return (
    <FormContainer 
      onSubmit={handleSubmit}
      instructions={
        <FormInstructions>
          {instructions}
        </FormInstructions>
      }
    >
      {apiError && (
        <div className="api-error-message">
          {apiError}
        </div>
      )}
      
      <BookFormFields 
        bookData={bookData}
        errors={errors}
        touched={touched}
        handleChange={handleChange}
        handleBlur={handleBlur}
      />

      <FormActions
        onCancel={handleCancel}
        submitText={loading ? `${submitText}...` : submitText}
        isSubmitting={loading}
      />
    </FormContainer>
  );
};

export default BookForm; 