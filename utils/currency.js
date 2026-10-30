// Parses USD amounts such as "$29.99" or "Tax: $3.84" into integer cents.
export function parseUsdToCents(text) {
  const match = text.trim().match(/^(?:[^$]*\$)?(\d+)\.(\d{2})$/);
  if (!match) {
    throw new Error(`Invalid USD amount: ${text}`);
  }
  const [, dollars, cents] = match;
  return Number(dollars) * 100 + Number(cents);
}

export function formatUsd(cents) {
  if (!Number.isSafeInteger(cents)) {
    throw new Error('USD amounts must be expressed as integer cents');
  }
  return `$${(cents / 100).toFixed(2)}`;
}
