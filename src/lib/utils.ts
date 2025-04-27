import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Address } from "viem";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
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
