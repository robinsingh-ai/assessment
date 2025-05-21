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

