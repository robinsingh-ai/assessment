import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FormActions from './FormActions';

// Mock the Button component
jest.mock('../common/Button', () => ({ 
  children, onClick, type, variant 
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant: string;
}) => (
  <button 
    onClick={onClick} 
    type={type} 
    className={`button ${variant}`}
    data-testid={`${variant}-button`}
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

  test('renders cancel button with secondary variant', () => {
    render(<FormActions onCancel={() => {}} />);
    
    expect(screen.getByTestId('secondary-button')).toBeInTheDocument();
    expect(screen.getByTestId('secondary-button')).toHaveTextContent('Cancel');
  });
}); 