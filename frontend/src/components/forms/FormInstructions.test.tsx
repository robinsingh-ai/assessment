import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FormInstructions from './FormInstructions';

describe('FormInstructions Component', () => {
  test('renders required fields text by default', () => {
    render(<FormInstructions />);
    expect(screen.getByText('Required fields')).toBeInTheDocument();
  });

  test('does not show required indicator when showRequiredIndicator is false', () => {
    render(<FormInstructions showRequiredIndicator={false} />);
    expect(screen.queryByText('Required fields')).not.toBeInTheDocument();
  });

  test('renders children content when provided', () => {
    render(
      <FormInstructions>
        <span>Custom instructions text</span>
      </FormInstructions>
    );
    
    expect(screen.getByText('Required fields')).toBeInTheDocument();
    expect(screen.getByText('Custom instructions text')).toBeInTheDocument();
  });

  test('renders both required indicator and children with a separator', () => {
    render(
      <FormInstructions>
        All fields must be filled
      </FormInstructions>
    );
    
    expect(screen.getByText('Required fields')).toBeInTheDocument();
    expect(screen.getByText('•')).toBeInTheDocument();
    expect(screen.getByText('All fields must be filled')).toBeInTheDocument();
  });

  test('renders only children without separator when required indicator is disabled', () => {
    render(
      <FormInstructions showRequiredIndicator={false}>
        All fields must be filled
      </FormInstructions>
    );
    
    expect(screen.queryByText('Required fields')).not.toBeInTheDocument();
    expect(screen.queryByText('•')).not.toBeInTheDocument();
    expect(screen.getByText('All fields must be filled')).toBeInTheDocument();
  });
}); 