import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
