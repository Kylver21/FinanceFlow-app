import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Hook personalizado para localStorage con soporte de usuario
 * Automáticamente agrega el user_id a la key para separar datos por usuario
 */
export function useUserLocalStorage<T>(key: string, initialValue: T) {
  const { user } = useAuth();
  
  // Crear key única por usuario
  const userKey = user?.id ? `${key}_${user.id}` : key;

  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(userKey);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  // Actualizar el valor cuando cambie el usuario o la key
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(userKey);
      if (item) {
        setStoredValue(JSON.parse(item));
      } else {
        setStoredValue(initialValue);
      }
    } catch (error) {
      setStoredValue(initialValue);
    }
  }, [userKey, user?.id]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(userKey, JSON.stringify(valueToStore));
    } catch (error) {
    }
  };

  return [storedValue, setValue] as const;
}
