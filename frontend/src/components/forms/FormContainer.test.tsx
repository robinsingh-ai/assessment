import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FormContainer from './FormContainer';

describe('FormContainer Component', () => {
  test('renders children correctly', () => {
    render(
      <FormContainer onSubmit={() => {}}>
        <div data-testid="test-child">Child Content</div>
      </FormContainer>
    );
    
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  test('calls onSubmit when form is submitted', () => {
    const handleSubmit = jest.fn(e => e.preventDefault());
    
    render(
      <FormContainer onSubmit={handleSubmit}>
        <button type="submit">Submit</button>
      </FormContainer>
    );
    
    fireEvent.submit(screen.getByTestId('form-element'));
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  test('renders instructions when provided', () => {
    render(
      <FormContainer 
        onSubmit={() => {}}
        instructions={<div data-testid="test-instructions">Form Instructions</div>}
      >
        <div>Form Content</div>
      </FormContainer>
    );
    
    expect(screen.getByTestId('test-instructions')).toBeInTheDocument();
    expect(screen.getByText('Form Instructions')).toBeInTheDocument();
    expect(screen.getByText('Form Content')).toBeInTheDocument();
  });

  test('does not render instructions section when not provided', () => {
    render(
      <FormContainer onSubmit={() => {}}>
        <div>Form Content</div>
      </FormContainer>
    );
    
    expect(screen.queryByTestId('form-instructions')).not.toBeInTheDocument();
  });
}); 