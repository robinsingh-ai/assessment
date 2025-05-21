import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FormActions from './FormActions';

// Mock the Button component
jest.mock('../common/Button', () => ({ 
  children, onClick, type, variant, icon, iconPosition, size, disabled, loading
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant: string;
  icon?: React.ReactNode;
  iconPosition?: string;
  size?: string;
  disabled?: boolean;
  loading?: boolean;
}) => (
  <button 
    onClick={onClick} 
    type={type} 
    className={`button ${variant}`}
    data-testid={`${variant}-button`}
    disabled={disabled}
  >
    {children}
  </button>
));

describe('FormActions Component', () => {
  test('renders Cancel and Submit buttons', () => {
    render(<FormActions onCancel={() => {}} />);
    
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  test('uses custom submit text when provided', () => {
    render(<FormActions onCancel={() => {}} submitText="Save Changes" />);
    
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save Changes')).toBeInTheDocument();
  });

  test('calls onCancel when Cancel button is clicked', () => {
    const handleCancel = jest.fn();
    render(<FormActions onCancel={handleCancel} />);
    
    fireEvent.click(screen.getByText('Cancel'));
    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  test('renders submit button with primary variant', () => {
    render(<FormActions onCancel={() => {}} />);
    
    expect(screen.getByTestId('primary-button')).toBeInTheDocument();
    expect(screen.getByTestId('primary-button')).toHaveTextContent('Submit');
  });

  test('renders cancel button with outline variant', () => {
    render(<FormActions onCancel={() => {}} />);
    
    expect(screen.getByTestId('outline-button')).toBeInTheDocument();
    expect(screen.getByTestId('outline-button')).toHaveTextContent('Cancel');
  });
  
  test('disables buttons when isSubmitting is true', () => {
    render(<FormActions onCancel={() => {}} isSubmitting={true} />);
    
    expect(screen.getByTestId('outline-button')).toBeDisabled();
  });
}); 