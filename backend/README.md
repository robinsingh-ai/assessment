# Library Management System - Backend

A RESTful API for managing a library of books.

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
└── server.ts         # Main application file
```

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

The server will be running at http://localhost:5000

### Scripts

- `npm run dev` - Starts the development server with hot-reloading
- `npm run build` - Builds the project for production
- `npm start` - Runs the production build
- `npm run watch` - Watches for changes and rebuilds

