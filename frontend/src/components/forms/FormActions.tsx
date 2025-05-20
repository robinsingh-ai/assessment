import React from 'react';
import Button from '../common/Button';
import './FormActions.css';

interface FormActionsProps {
  onCancel: () => void;
  submitText?: string;
}

const FormActions: React.FC<FormActionsProps> = ({ 
  onCancel, 
  submitText = 'Submit' 
}) => {
  return (
    <div className="form-actions">
      <Button variant="secondary" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" variant="primary">
        {submitText}
      </Button>
    </div>
  );
};

export default FormActions; 