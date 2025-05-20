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