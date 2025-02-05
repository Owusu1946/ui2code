export function colorToTailwind(prefix: string, color: string): string {
  // Convert hex to Tailwind color class
  const colorMap: Record<string, string> = {
    '#1E40AF': 'blue-700',
    '#22C55E': 'green-500',
    // Add more color mappings
  };

  const tailwindColor = colorMap[color.toUpperCase()] || color;
  return `${prefix}-${tailwindColor}`;
}

export function sizeToTailwind(prefix: string, size: string | number): string {
  const value = typeof size === 'number' ? size : parseInt(size);
  const tailwindSize = Math.round(value / 4); // Convert to Tailwind's 0.25rem units
  return `${prefix}-${tailwindSize}`;
} 