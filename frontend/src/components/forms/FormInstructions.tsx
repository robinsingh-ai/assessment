import React from 'react';
import './InputField.css'; // We'll use the styles from InputField.css

interface FormInstructionsProps {
  children?: React.ReactNode;
  showRequiredIndicator?: boolean;
}

const FormInstructions: React.FC<FormInstructionsProps> = ({ 
  children, 
  showRequiredIndicator = true 
}) => {
  return (
    <div className="form-instructions">
      {showRequiredIndicator && (
        <span className="required-text">
          Required fields
        </span>
      )}
      {children && (
        <>
          {showRequiredIndicator && <span style={{ margin: '0 8px' }}>•</span>}
          {children}
        </>
      )}
    </div>
  );
};

export default FormInstructions; 