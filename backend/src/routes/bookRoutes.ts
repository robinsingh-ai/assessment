import express from 'express';
import { 
  getAllBooks, 
 
} from '../controllers/bookController';

const router = express.Router();

// GET /books - Retrieves all books
router.get('/', getAllBooks);



export default router; 