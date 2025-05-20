import express from 'express';
import { 
  getAllBooks, 
  getBookById, 
  createBook, 
  updateBook, 
  deleteBook 
} from '../controllers/bookController';
import { 
  validateBookData, 
  validateBookId, 
  checkDuplicateISBN,
  checkDuplicateISBNOnUpdate
} from '../middleware/bookValidation';

const router = express.Router();

// GET /books - Retrieves all books
router.get('/', getAllBooks);

// GET /books/:id - Retrieves a specific book
router.get('/:id', validateBookId, getBookById);

// POST /books - Adds a new book
router.post('/', validateBookData, checkDuplicateISBN, createBook);

// PUT /books/:id - Updates an existing book
router.put('/:id', validateBookId, validateBookData, checkDuplicateISBNOnUpdate, updateBook);

// DELETE /books/:id - Deletes a book
router.delete('/:id', validateBookId, deleteBook);

export default router; 