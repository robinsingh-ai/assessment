import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import InputField from './InputField';

describe('InputField Component', () => {
  test('renders the input field with label', () => {
    render(
      <InputField
        id="test-input"
        name="test"
        label="Test Label"
        value=""
        onChange={() => {}}
        required
      />
    );

    expect(screen.getByLabelText((content) => content.startsWith('Test Label'))).toBeInTheDocument();
  });

  test('displays error message when error prop is provided', () => {
    render(
      <InputField
        id="test-input"
        name="test"
        label="Test Label"
        value=""
        onChange={() => {}}
        error="This field is required"
      />
    );

    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  test('calls onChange handler when input value changes', () => {
    const handleChange = jest.fn();
    render(
      <InputField
        id="test-input"
        name="test"
        label="Test Label"
        value=""
        onChange={handleChange}
      />
    );

    fireEvent.change(screen.getByLabelText('Test Label'), { target: { value: 'New Value' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
}); 