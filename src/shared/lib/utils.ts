import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Create formatCurrency function to format number to currency string (IDR)
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Capitalize each word in a string. Example: "percentage nominal" -> "Percentage Nominal"
export function capitalizeWords(input: string | undefined | null): string {
  if (!input) return '';
  // replace underscores/dashes with spaces, then capitalise each word
  const normalized = String(input).replace(/[_-]+/g, ' ');
  return normalized
    .split(/\s+/)
    .map((w) => (w.length > 0 ? w[0].toUpperCase() + w.slice(1).toLowerCase() : ''))
    .join(' ');
}