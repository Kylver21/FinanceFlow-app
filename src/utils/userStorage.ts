/**
 * Utilidades para manejo de localStorage con separación por usuario
 */

/**
 * Obtener un valor del localStorage específico del usuario
 */
export const getUserLocalStorage = (userId: string, key: string): string | null => {
  try {
    return localStorage.getItem(`${key}_${userId}`);
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

/**
 * Guardar un valor en localStorage específico del usuario
 */
export const setUserLocalStorage = (userId: string, key: string, value: string): void => {
  try {
    localStorage.setItem(`${key}_${userId}`, value);
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
};

/**
 * Eliminar un valor específico del usuario
 */
export const removeUserLocalStorage = (userId: string, key: string): void => {
  try {
    localStorage.removeItem(`${key}_${userId}`);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

/**
 * Limpiar todos los datos del localStorage relacionados con un usuario específico
 */
export const clearUserLocalStorage = (userId: string): void => {
  try {
    const allKeys = Object.keys(localStorage);
    const userKeys = allKeys.filter(key => key.endsWith(`_${userId}`));
    
    userKeys.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log(`Cleared ${userKeys.length} localStorage items for user ${userId}`);
  } catch (error) {
    console.error('Error clearing user localStorage:', error);
  }
};

/**
 * Limpiar todo el localStorage excepto keys específicas (útil en logout)
 */
export const clearAllExceptKeys = (keysToKeep: string[] = []): void => {
  try {
    const allKeys = Object.keys(localStorage);
    
    allKeys.forEach(key => {
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });
    
    console.log(`Cleared localStorage, kept ${keysToKeep.length} keys`);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};
