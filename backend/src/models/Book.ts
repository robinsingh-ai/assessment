// Book model
export interface Book {
  id: string;
  isbn: string;  // 13-digit ISBN (without hyphens)
  title: string;
  author: string;
  yearPublished: number;
  genre: string;
}

// Sample data
// export const books: Book[] = [
//   {
//     id: '1',
//     title: 'To Kill a Mockingbird',
//     author: 'Harper Lee',
//     yearPublished: 1960,
//     genre: 'Fiction'
//   },
//   {
//     id: '2',
//     title: '1984',
//     author: 'George Orwell',
//     yearPublished: 1949,
//     genre: 'Dystopian'
//   },
//   {
//     id: '3',
//     title: 'The Great Gatsby',
//     author: 'F. Scott Fitzgerald',
//     yearPublished: 1925,
//     genre: 'Classic'
//   }
// ]; 