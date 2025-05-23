# Book Management System - Frontend

This is the frontend application for the Book Management System, a React-based web application for managing a collection of books. The application allows users to view, search, add, edit, and delete books.

## Project Overview

This frontend application is built with:
- React with TypeScript
- React Router for navigation
- CSS for styling (with a responsive design)
- Custom hooks for state management and API communication

The application features:
- Responsive design that works on both desktop and mobile devices
- Book listing with search and filtering capabilities
- Forms for adding and editing books
- Navigation system with search functionality

## Project Structure

This frontend application is organized into the following structure:

### Core Files
- `src/index.tsx` - The entry point of the application
- `src/App.tsx` - The main App component that sets up routing with React Router and includes:
  - Navbar component for navigation
  - Content container for route components
  - MobileBottomNav for mobile navigation
- `src/App.css` - Main application styles
- `src/index.css` - Global CSS styles

### Components
The components are organized by feature in the `src/components` directory:

#### Books Components
- `BookList.tsx` - Displays a list of books with search and filtering capabilities
- `BookCard.tsx` - Card component to display individual book information
- `AddBook.tsx` - Component for adding a new book
- `EditBook.tsx` - Component for editing an existing book
- `BookForm.tsx` - Reusable form component used by both Add and Edit book components
- `BookFormFields.tsx` - Form field definitions for book data entry

#### Common Components
- `Button.tsx` - Reusable button component with various styles and states

#### Navbar Components
- `Navbar.tsx` - Main navigation bar component
- `NavMenu.tsx` - Navigation menu component
- `NavMenuItem.tsx` - Individual navigation menu item
- `NavSearch.tsx` - Search component in the navigation bar
- `NavbarLogo.tsx` - Logo component for the navigation bar

#### Layout Components
Contains layout-related components like containers and grid systems
- `MobileBottomNav.tsx` - Mobile navigation bar that appears at the bottom of the screen on small devices
- `PageContainer.tsx` - Container component for consistent page layout

#### Forms Components
Contains form-related components and utilities

#### Home Components
Components specific to the home page

### Routes
- `src/routes/index.tsx` - Defines the application routing with the following paths:
  - `/` - Home page
  - `/books` - Book listing page
  - `/add` - Add new book page
  - `/edit/:id` - Edit book page with dynamic ID parameter

### Services
- `src/services/api.ts` - API service for backend communication with the following methods:
  - `getAllBooks()` - Fetches all books from the API
  - `getBookById(id)` - Fetches a specific book by ID
  - `createBook(book)` - Creates a new book
  - `updateBook(id, book)` - Updates an existing book
  - `deleteBook(id)` - Deletes a book by ID
- `src/services/api.test.ts` - Tests for the API service

### Other Directories

#### Hooks
- `useBookData.ts` - Hook for accessing and managing book data
- `useBookActions.ts` - Hook for book-related actions (create, update, delete)
- `useBookSearch.ts` - Hook for book search functionality
- `useBookForm.ts` - Hook for managing book form state and validation
- `useApi.ts` - Hook for making API calls

#### Types
- `index.ts` - Contains TypeScript interfaces including the Book interface

#### Store
- `bookStore.ts` - State management for books using Zustand
- `bookStore.test.ts` - Tests for the book store

## Getting Started with Development

1. Clone the repository
2. Run `npm install` or `yarn` to install dependencies
3. Run `npm start` or `yarn start` to start the development server
4. Open [http://localhost:3000](http://localhost:3000) to view the application
