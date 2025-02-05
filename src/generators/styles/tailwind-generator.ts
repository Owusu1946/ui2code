import { StyleGenerator } from '../types';
import { colorToTailwind, sizeToTailwind } from '../../utils/style-utils';

export class TailwindGenerator implements StyleGenerator {
  generateStyles(): string {
    return ''; // Tailwind doesn't need additional styles
  }

  generateClassName(styles: Record<string, string | number>): string {
    const classes: string[] = [];

    Object.entries(styles).forEach(([property, value]) => {
      switch (property) {
        case 'backgroundColor':
          classes.push(colorToTailwind('bg', value as string));
          break;
        case 'color':
          classes.push(colorToTailwind('text', value as string));
          break;
        case 'fontSize':
          classes.push(sizeToTailwind('text', value));
          break;
        case 'padding':
          classes.push(sizeToTailwind('p', value));
          break;
        case 'borderRadius':
          classes.push(sizeToTailwind('rounded', value));
          break;
        // Add more style mappings
      }
    });

    return classes.join(' ');
  }
} 