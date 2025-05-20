import express from 'express';
import { 
  getAllBooks, 
  getBookById, 
  createBook, 
  updateBook, 
  deleteBook 
} from '../controllers/bookController';

const router = express.Router();

// GET /books - Retrieves all books
router.get('/', getAllBooks);

// GET /books/:id - Retrieves a specific book
router.get('/:id', getBookById);

// POST /books - Adds a new book
router.post('/', createBook);

// PUT /books/:id - Updates an existing book
router.put('/:id', updateBook);

// DELETE /books/:id - Deletes a book
router.delete('/:id', deleteBook);

export default router; 