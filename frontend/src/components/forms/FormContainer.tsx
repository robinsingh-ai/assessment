import React from 'react';
import './FormContainer.css';

interface FormContainerProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  instructions?: React.ReactNode;
}

const FormContainer: React.FC<FormContainerProps> = ({ 
  children, 
  onSubmit,
  instructions 
}) => {
  return (
    <div className="form-container">
      <form onSubmit={onSubmit} data-testid="form-element">
        {instructions && (
          <div className="form-container-instructions" data-testid="form-instructions">
            {instructions}
          </div>
        )}
        {children}
      </form>
    </div>
  );
};

export default FormContainer; 