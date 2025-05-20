export interface Book {
  id: string;
  isbn: string;  // 13-digit ISBN (without hyphens)
  title: string;
  author: string;
  yearPublished: number;
  genre: string;
} 