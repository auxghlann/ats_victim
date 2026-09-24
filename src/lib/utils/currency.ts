export interface CurrencyOption {
  code: string;
  symbol: string;
  label: string;
}

export const SUPPORTED_CURRENCIES: CurrencyOption[] = [
  { code: "PHP", symbol: "₱", label: "PHP (₱)" },
  { code: "USD", symbol: "$", label: "USD ($)" },
  { code: "EUR", symbol: "€", label: "EUR (€)" },
  { code: "GBP", symbol: "£", label: "GBP (£)" },
  { code: "SGD", symbol: "S$", label: "SGD (S$)" },
  { code: "AUD", symbol: "A$", label: "AUD (A$)" },
  { code: "CAD", symbol: "C$", label: "CAD (C$)" },
  { code: "JPY", symbol: "¥", label: "JPY (¥)" },
];

export const DEFAULT_CURRENCY = "PHP";

export function getCurrencySymbol(currency?: string | null): string {
  if (!currency) return "₱";
  const match = SUPPORTED_CURRENCIES.find(
    (c) => c.code.toUpperCase() === currency.toUpperCase()
  );
  return match ? match.symbol : currency.toUpperCase();
}

export function formatSalaryRange(
  min?: number | null,
  max?: number | null,
  currency?: string | null,
  options?: { badge?: boolean }
): string {
  if (!min && !max) return "Undisclosed";
  const symbol = getCurrencySymbol(currency);

  if (min && max) {
    return `${symbol}${Math.round(min / 1000)}k - ${symbol}${Math.round(max / 1000)}k`;
  }
  if (min) {
    return options?.badge
      ? `${symbol}${Math.round(min / 1000)}k+`
      : `From ${symbol}${Math.round(min / 1000)}k`;
  }
  return `Up to ${symbol}${Math.round(max! / 1000)}k`;
}
