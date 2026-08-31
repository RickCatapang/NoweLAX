// src/lib/utils/normalize.ts

/**
 * Normalizes a string by:
 * - Trimming whitespace
 * - Converting to lowercase
 * - Replacing multiple spaces with single space
 */
export function normalizeString(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Checks if two strings are equal after normalization
 */
export function areEqualNormalized(a: string, b: string): boolean {
  return normalizeString(a) === normalizeString(b);
}
