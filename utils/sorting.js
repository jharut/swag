// Return new arrays so checks never modify the original collected values.
export function sortNumbersAscending(values) {
  return [...values].sort((a, b) => a - b);
}

export function sortNumbersDescending(values) {
  return [...values].sort((a, b) => b - a);
}

export function sortTextAscending(values) {
  return [...values].sort((a, b) => a.localeCompare(b, 'en'));
}
