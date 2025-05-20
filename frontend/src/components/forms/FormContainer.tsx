import React from 'react';
import './FormContainer.css';

interface FormContainerProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
}

const FormContainer: React.FC<FormContainerProps> = ({ children, onSubmit }) => {
  return (
    <div className="form-container">
      <form onSubmit={onSubmit}>
        {children}
      </form>
    </div>
  );
};

export default FormContainer; 