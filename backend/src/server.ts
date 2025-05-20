import express, { Express } from 'express';
import cors from 'cors';
import bookRoutes from './routes/bookRoutes';

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || '5001', 10);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/books', bookRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Library Management API is running...');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app; 