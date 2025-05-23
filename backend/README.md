# Book Management System - Backend

This is the backend API for the Book Management System, a RESTful service for managing a collection of books. The API provides endpoints for creating, reading, updating, and deleting books.

## Project Overview

This backend application is built with:
- Node.js and Express for the API framework
- TypeScript for type safety and better developer experience
- JSON file-based data persistence using a Singleton pattern
- Comprehensive validation and error handling
- Extensive unit and integration testing

The application features:
- RESTful API endpoints for book management
- Data validation with detailed error messages
- Persistent storage between server restarts
- Logging of all requests and responses

## Technologies Used

- Node.js
- Express
- TypeScript
- JSON file-based persistence with Singleton pattern

## Data Persistence

The application uses a Singleton pattern for database operations. Data is stored in two places:
1. In-memory for fast access
2. In a JSON file (data/books.json) for persistence between server restarts

Any changes made to the book collection (add, update, delete) are immediately saved to both the in-memory store and the JSON file.

## Architecture

The application follows a layered architecture pattern:

1. **Routes Layer** - Defines the API endpoints and connects them to controllers
2. **Controller Layer** - Handles HTTP requests and responses
3. **Service Layer** - Contains business logic and communicates with the data layer
4. **Data Layer** - Manages data persistence (DbManager)

This separation of concerns makes the code more maintainable, testable, and scalable. Each layer has a specific responsibility:

- Routes are responsible for defining API endpoints and applying middleware
- Controllers are responsible for handling HTTP requests and responses
- Services are responsible for implementing business logic
- DbManager is responsible for data persistence

## Book Model

Each book in the library has the following properties:

- `id`: Unique identifier (generated automatically)
- `isbn`: International Standard Book Number (13-digit ISBN)
- `title`: Book title
- `author`: Book author
- `yearPublished`: Year the book was published
- `genre`: Book genre

## Middleware

The application uses several middleware components for improved functionality:

### Request Logger
- Logs all incoming requests with method, URL, and timestamp
- For POST and PUT requests, logs the request body
- Logs response status code and request duration after completion

### Validation Middleware
- `validateBookData`: Validates book data for creation and updates
  - Ensures ISBN is a valid 13-digit ISBN with correct check digit
  - Ensures title, author, and genre are non-empty strings
  - Validates that yearPublished is a valid number between 1000 and current year
- `validateBookId`: Validates that book IDs in URL parameters are valid
- `checkDuplicateISBN`: Prevents creating books with duplicate ISBNs
- `checkDuplicateISBNOnUpdate`: Prevents updating a book with an ISBN that belongs to another book

### Error Handling
- Global error handler that catches and formats all errors
- Custom ApiError class for consistent error responses
- Proper HTTP status codes for different error types

## API Endpoints

- `GET /books` - Retrieves all books
- `GET /books/:id` - Retrieves a specific book
- `POST /books` - Adds a new book
- `PUT /books/:id` - Updates an existing book
- `DELETE /books/:id` - Deletes a book

## Project Structure

```
src/
├── controllers/      # Request handlers
├── middleware/       # Middleware functions (validation, error handling, logging)
├── models/           # Data models and interfaces
├── routes/           # API routes
├── services/         # Business logic
├── utils/            # Utility functions and classes (includes DbManager)
├── __tests__/        # Test files
└── server.ts         # Main application file
```

### Core Files
- `server.ts` - The main application file that sets up Express, middleware, and routes

### Controllers
- `bookController.ts` - Handles HTTP requests and responses for book operations:
  - `getAllBooks()` - Retrieves all books
  - `getBookById()` - Retrieves a specific book by ID
  - `createBook()` - Creates a new book
  - `updateBook()` - Updates an existing book
  - `deleteBook()` - Deletes a book

### Services
- `bookService.ts` - Contains business logic for book operations:
  - `getAllBooks()` - Gets all books from the database
  - `getBookById()` - Gets a specific book by ID
  - `createBook()` - Creates a new book
  - `updateBook()` - Updates an existing book
  - `deleteBook()` - Deletes a book

### Models
- `Book.ts` - Defines the Book interface with properties like id, isbn, title, author, yearPublished, and genre

### Routes
- `bookRoutes.ts` - Defines API endpoints and connects them to controllers and middleware

### Middleware
- `bookValidation.ts` - Contains validation middleware for book operations
- `errorHandler.ts` - Global error handling middleware and ApiError class
- `requestLogger.ts` - Logs incoming requests and their responses

### Utils
- `dbManager.ts` - Singleton class that manages data persistence with the following methods:
  - `getAllBooks()` - Gets all books from memory
  - `getBookById()` - Gets a specific book by ID
  - `getBookByISBN()` - Gets a book by ISBN
  - `isbnExists()` - Checks if a book with a given ISBN exists
  - `addBook()` - Adds a new book
  - `updateBook()` - Updates an existing book
  - `deleteBook()` - Deletes a book
  - `saveToFile()` - Persists data to the JSON file

### Tests
- `api.test.ts` - Integration tests for API endpoints
- `bookController.test.ts` - Unit tests for the book controller
- `bookService.test.ts` - Unit tests for the book service
- `dbManager.test.ts` - Unit tests for the database manager
- `bookValidation.test.ts` - Unit tests for validation middleware
- `errorHandler.test.ts` - Unit tests for error handling middleware

## Getting Started

### Prerequisites

- Node.js (v12+)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

The server will be running at http://localhost:5001

### Scripts

- `npm run dev` - Starts the development server with hot-reloading
- `npm run build` - Builds the project for production
- `npm start` - Runs the production build
- `npm run watch` - Watches for changes and rebuilds

## Testing

The application includes comprehensive test coverage using Jest:

- **Unit Tests** - Test individual components in isolation
  - Controllers
  - Services
  - Middleware
  - Utility functions

- **Integration Tests** - Test the API endpoints end-to-end

To run tests:
```
npm test
```

To run tests with coverage report:
```
npm run test:coverage
```

