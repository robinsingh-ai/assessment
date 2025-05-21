# Frontend Unit Tests 

## Component Tests

### Button Component (`src/components/common/Button.test.tsx`)

Tests the Button component's functionality:

- **Rendering**: Verifies button renders with correct text
- **Variant Classes**: Tests different button variants (primary, secondary) are applied correctly
- **Default Styling**: Confirms primary is the default class
- **Event Handling**: Validates onClick handler is called when button is clicked
- **Button Types**: Tests submit type is properly applied
- **Custom Classes**: Verifies custom classNames are properly added

### Form Components

#### InputField (`src/components/forms/InputField.test.tsx`)

Tests for the form input field component:

- **Label Rendering**: Tests if the input field renders with its label
- **Error Handling**: Verifies error messages appear when provided in props
- **Event Handling**: Tests onChange events are properly triggered

#### FormContainer (`src/components/forms/FormContainer.test.tsx`)

Tests the form container wrapper:

- **Child Rendering**: Ensures children components render correctly inside the container
- **Form Submission**: Tests the onSubmit handler is called when form is submitted
- **Instructions Display**: Verifies optional instructions are rendered when provided
- **Conditional Rendering**: Tests instructions section is not rendered when not provided

#### FormInstructions (`src/components/forms/FormInstructions.test.tsx`)

Tests for the form instructions component:

- **Default State**: Tests rendering of required fields text by default
- **Prop Control**: Tests hiding required indicators when showRequiredIndicator is false
- **Child Content**: Verifies children content renders properly
- **Text Separator**: Tests separator is displayed when both required text and children are present
- **Content Without Indicator**: Ensures children render without separator when indicator is disabled

#### FormActions (`src/components/forms/FormActions.test.tsx`)

Tests for the form action buttons:

- **Button Rendering**: Tests Cancel and Submit buttons render correctly
- **Custom Text**: Verifies custom submit text appears when provided
- **Event Handling**: Tests onCancel handler is called when Cancel button is clicked
- **Button Variants**: Verifies proper variant styling (primary/secondary) for each button

## State Management Tests

### Bookstore State Management (`src/store/bookStore.test.ts`)

Tests for the Zustand store that manages book data using integration testing with the real backend API:

#### CRUD Lifecycle Testing:
- **Full CRUD Flow**: Tests complete create, read, update, and delete operations against the actual backend
- **Data Verification**: Verifies data is correctly persisted and retrieved after each operation
- **Edge Cases**: Tests handling of non-existent books, invalid data, and duplicate ISBNs

#### State Management Testing:
- **Loading States**: Verifies loading states change correctly during asynchronous operations
- **Error Handling**: Tests that error states are properly set when operations fail
- **Error Clearing**: Confirms error states are cleared on successful operations

#### Integration Testing Features:
- Tests use the actual backend API instead of mocks
- Creates real data on the backend and cleans up after tests
- Uses random ISBNs to prevent test collisions
- Properly handles test setup and teardown with React's act() for state updates

## API Service Tests

### Book API Service (`src/services/api.test.ts`)

Integration tests for the API service responsible for CRUD operations against the real backend:

- **GET Operations**:
  - Tests actual book retrieval from the backend
  - Verifies response structure from real API
  - Tests handling of non-existent resources

- **POST Operations**:
  - Tests real book creation with random ISBNs
  - Tests validation errors with invalid data
  - Tests duplicate ISBN handling

- **PUT Operations**:
  - Tests actual book updates with verification
  - Tests handling of updates to non-existent books

- **DELETE Operations**:
  - Tests successful deletion with verification
  - Tests deletion of non-existent resources

#### Integration Testing Features:
- Uses the real backend endpoints instead of mocking fetch
- Tests the complete request-response cycle
- Validates backend data constraints (ISBN format, required fields)
- Cleans up created test data after tests complete
- Avoids test data collisions with random identifiers

## Testing Strategies

### Unit Testing vs. Integration Testing

This project demonstrates both testing approaches:

- **Unit Tests**:
  - Used for UI components where rendering and user interaction are the focus
  - Isolates components from external dependencies
  - Faster execution, more focused on component contracts

- **Integration Tests**:
  - Used for API services and state management
  - Tests against the actual backend API
  - Validates end-to-end functionality
  - Catches issues that might be missed with mocks
  - More closely resembles real application usage




To run all tests:

```bash
npm test
```

To run tests in a specific file:

```bash
npm test -- path/to/test/file.test.tsx
```

To run tests without watch mode:

```bash
npm test -- --watchAll=false
```

To check test coverage:

```bash
npm test -- --coverage
``` 