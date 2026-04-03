import { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ErrorResponseApi } from "../types/api/type";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Capitalize the first letter of each word in the given text.
 * Preserves whitespace separators.
 * Returns an empty string for null/undefined inputs.
 */
export function capitalizeWords(input?: string | null): string {
  if (!input) return '';

  // Split and keep separators so we preserve original spacing
  return input
    .split(/(\s+)/)
    .map((part) => {
      if (part.trim() === '') return part;
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join('');
}

export function handleAxiosError(error: unknown): string {
  const errCast = error as AxiosError;
  const errorResponse = errCast?.response?.data as ErrorResponseApi;
  return errorResponse?.message || errorResponse?.error || "Something went wrong";
}
