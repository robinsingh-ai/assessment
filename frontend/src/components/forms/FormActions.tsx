import React from 'react';
import Button from '../common/Button';
import './FormActions.css';

// Icons
const SaveIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V7L17 3ZM19 19H5V5H16.17L19 7.83V19ZM12 12C10.34 12 9 13.34 9 15C9 16.66 10.34 18 12 18C13.66 18 15 16.66 15 15C15 13.34 13.66 12 12 12ZM7 7H15V9H7V7Z" fill="currentColor"/>
  </svg>
);

const CancelIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
  </svg>
);

interface FormActionsProps {
  onCancel: () => void;
  submitText?: string;
  isSubmitting?: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({ 
  onCancel, 
  submitText = 'Submit',
  isSubmitting = false
}) => {
  return (
    <div className="form-actions">
      <Button 
        variant="outline" 
        onClick={onCancel}
        icon={<CancelIcon />}
        iconPosition="left"
        size="md"
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        variant="primary"
        icon={<SaveIcon />}
        iconPosition="left"
        size="md"
        loading={isSubmitting}
      >
        {submitText}
      </Button>
    </div>
  );
};

export default FormActions; 