import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Address } from "viem";

/**
 * A utility function to conditionally join Tailwind CSS classes together
 * Uses clsx for conditional class joining and twMerge to properly merge Tailwind classes
 *
 * @param inputs - Class values to be conditionally joined
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * A utility function to format a given address string
 * It keeps a specified number of characters at the start and end of the address,
 * replacing the middle part with ellipsis if the address is long enough
 *
 * @param address - The address string to format
 * @param prefixLength - Number of characters to keep at the start of the address
 * @param suffixLength - Number of characters to keep at the end of the address
 * @returns Formatted address string
 */
export const formatAddress = (
  address: Address | string,
  prefixLength = 4,
  suffixLength = 5
) => {
  if (!address || address.length < prefixLength + suffixLength + 2)
    return address;
  return `${address.slice(0, prefixLength + 2)}...${address.slice(
    -suffixLength
  )}`;
};

// Format a number with thousands separators
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 6,
    minimumFractionDigits: 0,
  }).format(value);
}

// Format a currency value
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value);
}
