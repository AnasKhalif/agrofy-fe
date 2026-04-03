/**
 * Simple encryption utilities for localStorage data
 * Uses base64 encoding with a simple XOR cipher for basic obfuscation
 * Note: This is NOT cryptographically secure, but provides basic protection
 * against casual inspection of localStorage
 */

const ENCRYPTION_KEY = 'nex-healthcare-registration-2024';

/**
 * Simple XOR cipher for string encryption
 */
function xorCipher(input: string, key: string): string {
  let output = '';
  for (let i = 0; i < input.length; i++) {
    const charCode = input.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    output += String.fromCharCode(charCode);
  }
  return output;
}

/**
 * Encrypts data for localStorage storage
 * @param data - The data object to encrypt
 * @returns Encrypted string
 */
export function encryptData<T>(data: T): string {
  try {
    const jsonString = JSON.stringify(data);
    const encrypted = xorCipher(jsonString, ENCRYPTION_KEY);
    // Convert to base64 for safe storage
    return btoa(encrypted);
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypts data from localStorage
 * @param encryptedData - The encrypted string from localStorage
 * @returns Decrypted data object
 */
export function decryptData<T>(encryptedData: string): T {
  try {
    // Decode from base64
    const decoded = atob(encryptedData);
    const decrypted = xorCipher(decoded, ENCRYPTION_KEY);
    return JSON.parse(decrypted) as T;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Safely stores encrypted data in localStorage
 * @param key - localStorage key
 * @param data - Data to encrypt and store
 */
export function setEncryptedItem<T>(key: string, data: T): void {
  try {
    const encrypted = encryptData(data);
    localStorage.setItem(key, encrypted);
  } catch (error) {
    console.error('Failed to store encrypted data:', error);
    throw error;
  }
}

/**
 * Safely retrieves and decrypts data from localStorage
 * @param key - localStorage key
 * @returns Decrypted data or null if not found
 */
export function getEncryptedItem<T>(key: string): T | null {
  try {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) {
      return null;
    }
    return decryptData<T>(encrypted);
  } catch (error) {
    console.error('Failed to retrieve encrypted data:', error);
    // If decryption fails, remove the corrupted data
    localStorage.removeItem(key);
    return null;
  }
}

/**
 * Removes encrypted item from localStorage
 * @param key - localStorage key
 */
export function removeEncryptedItem(key: string): void {
  localStorage.removeItem(key);
}
