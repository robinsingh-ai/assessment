import { useState } from 'react';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export const useApi = <T>({ onSuccess, onError }: UseApiOptions = {}) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = async <R>(
    apiCall: () => Promise<R>,
    successCallback?: (result: R) => void,
    errorCallback?: (error: Error) => void
  ): Promise<R | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      setData(result as unknown as T);
      
      if (successCallback) {
        successCallback(result);
      }
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      setLoading(false);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      
      if (errorCallback) {
        errorCallback(error);
      }
      
      if (onError) {
        onError(error);
      }
      
      setLoading(false);
      return null;
    }
  };

  return {
    data,
    loading,
    error,
    execute,
    setData,
    setLoading,
    setError
  };
}; 