import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to log all incoming requests
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  // Log request details
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  // Log request body for POST and PUT requests
  if (['POST', 'PUT'].includes(req.method) && Object.keys(req.body).length > 0) {
    console.log('Request Body:', JSON.stringify(req.body));
  }
  
  // Add response listener to log after request is complete
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
  });
  
  next();
}; 