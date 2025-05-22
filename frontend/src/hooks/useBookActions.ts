import { useState } from 'react';
import { useBookStore } from '../store/bookStore';

export const useBookActions = () => {
  const { deleteBook } = useBookStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteBook = async (id: string, title: string): Promise<boolean> => {
    if (window.confirm(`Are you sure you want to delete ${title}?`)) {
      try {
        setIsDeleting(true);
        setDeleteError(null);
        await deleteBook(id);
        return true;
      } catch (error) {
        console.error('Error deleting book:', error);
        setDeleteError(error instanceof Error ? error.message : 'Failed to delete book');
        return false;
      } finally {
        setIsDeleting(false);
      }
    }
    return false;
  };

  return {
    isDeleting,
    deleteError,
    handleDeleteBook
  };
}; 