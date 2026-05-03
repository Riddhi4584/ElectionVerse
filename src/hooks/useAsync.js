import { useState, useCallback } from 'react';
import { parseError } from '../utils/errorHandler';

/**
 * Custom hook to handle asynchronous operations, managing loading, error, and data states.
 * 
 * @param {Function} asyncFunction - The asynchronous function to execute.
 * @param {boolean} immediate - Whether to execute the function immediately upon mount.
 * @returns {Object} { execute, status, value, error, isLoading }
 */
export const useAsync = (asyncFunction, immediate = false) => {
  const [status, setStatus] = useState('idle');
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);

  // The execute function wraps asyncFunction and
  // handles setting state for pending, value, and error.
  // useCallback ensures the below useEffect is not called
  // on every render, but only if asyncFunction changes.
  const execute = useCallback(
    async (...args) => {
      setStatus('pending');
      setValue(null);
      setError(null);
      try {
        const response = await asyncFunction(...args);
        setValue(response);
        setStatus('success');
        return { success: true, data: response };
      } catch (err) {
        const parsedError = parseError(err);
        setError(parsedError);
        setStatus('error');
        return { success: false, error: parsedError };
      }
    },
    [asyncFunction]
  );

  return {
    execute,
    status,
    value,
    error,
    isLoading: status === 'pending',
  };
};
