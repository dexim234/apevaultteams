// Utility functions for Firestore operations
// Removes undefined values from objects before saving to Firestore

export const removeUndefined = <T extends Record<string, any>>(obj: T): Partial<T> => {
  const cleaned: Partial<T> = {}
  for (const key in obj) {
    if (obj[key] !== undefined) {
      cleaned[key] = obj[key]
    }
  }
  return cleaned
}



