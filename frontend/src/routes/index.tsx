import React from 'react';
import HomePage from '../components/home/HomePage';
import BookList from '../components/books/BookList';
import AddBook from '../components/books/AddBook';
import EditBook from '../components/books/EditBook';

export interface Route {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
}

const routes: Route[] = [
  {
    path: '/',
    component: HomePage,
    exact: true,
  },
  {
    path: '/books',
    component: BookList,
    exact: true,
  },
  {
    path: '/add',
    component: AddBook,
    exact: true,
  },
  {
    path: '/edit/:id',
    component: EditBook,
    exact: true,
  },
];

export default routes; 