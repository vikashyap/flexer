import { describe, expect, it } from "vitest";
import { cn, formatAddress, formatCurrency, formatNumber } from "./utils";

describe("Utility Functions", () => {
  describe("cn", () => {
    it("should merge multiple class names correctly", () => {
      expect(cn("bg-red-500", "text-white", "p-4")).toBe(
        "bg-red-500 text-white p-4"
      );
    });

    it("should remove duplicate classes", () => {
      expect(cn("bg-red-500", "bg-red-500", "text-white")).toBe(
        "bg-red-500 text-white"
      );
    });

    it("should handle conditional classes", () => {
      expect(cn("text-sm", { "font-bold": true, "font-thin": false })).toBe(
        "text-sm font-bold"
      );
    });
  });

  describe("formatAddress", () => {
    it("should shorten an address correctly", () => {
      expect(formatAddress("0x1234567890abcdef1234567890abcdef12345678")).toBe(
        "0x1234...45678"
      );
    });

    it("should return short address as-is without formatting", () => {
      expect(formatAddress("0x1234")).toBe("0x1234");
    });

    it("should handle undefined or empty address", () => {
      expect(formatAddress("")).toBe("");
      expect(formatAddress(undefined as unknown as string)).toBe(undefined);
    });
  });

  describe("formatNumber", () => {
    it("should format numbers with commas", () => {
      expect(formatNumber(1234567)).toBe("1,234,567");
      expect(formatNumber(1234.56789)).toBe("1,234.56789");
    });

    it("should not show unnecessary decimals", () => {
      expect(formatNumber(1000)).toBe("1,000");
    });
  });

  describe("formatCurrency", () => {
    it("should format a number as USD currency", () => {
      expect(formatCurrency(1234.56)).toBe("$1,234.56");
      expect(formatCurrency(1000000)).toBe("$1,000,000.00");
    });

    it("should format with two decimal places", () => {
      expect(formatCurrency(99)).toBe("$99.00");
    });
  });
});
