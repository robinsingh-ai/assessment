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
}) => {
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
        min={min}
        max={max}
        className={error ? 'error-input' : ''}
        required={required}
      />
      {error && <span className="error">{error}</span>}
    </div>
  );
};

export default InputField; 