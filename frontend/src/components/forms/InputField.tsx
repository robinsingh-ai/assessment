import React from 'react';
import './InputField.css';

interface InputFieldProps {
  id: string;
  name: string;
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  min?: string | number;
  max?: string | number;
  error?: string;
  required?: boolean;
  placeholder?: string;
  pattern?: string;
  validateOnBlur?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  description?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  type = 'text',
  min,
  max,
  error,
  required = false,
  placeholder,
  pattern,
  validateOnBlur = false,
  onBlur,
  description,
}) => {
  const errorId = `${id}-error`;
  const descriptionId = description ? `${id}-description` : undefined;
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (onBlur) {
      onBlur(e);
    }
  };

  return (
    <div className="form-group">
      <label htmlFor={id}>
        {label}
        {required && <span className="required">*</span>}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        min={min}
        max={max}
        pattern={pattern}
        className={error ? 'error-input' : ''}
        required={required}
        placeholder={placeholder}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={`${error ? errorId : ''} ${descriptionId || ''}`}
      />
      {description && (
        <div id={descriptionId} className="input-description">
          {description}
        </div>
      )}
      {error && <span className="error" id={errorId}>{error}</span>}
    </div>
  );
};

export default InputField; 