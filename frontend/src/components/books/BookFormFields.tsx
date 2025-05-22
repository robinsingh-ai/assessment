import React from 'react';
import { Book } from '../../types';
import InputField from '../forms/InputField';

interface BookFormFieldsProps {
  bookData: Omit<Book, 'id'>;
  errors: Partial<Record<keyof Omit<Book, 'id'>, string>>;
  touched: Partial<Record<keyof Omit<Book, 'id'>, boolean>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const BookFormFields: React.FC<BookFormFieldsProps> = ({
  bookData,
  errors,
  touched,
  handleChange,
  handleBlur
}) => {
  return (
    <>
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
    </>
  );
};

export default BookFormFields; 