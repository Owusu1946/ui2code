import { StyleGenerator } from '../types';

export class CSSInJSGenerator implements StyleGenerator {
  generateStyles(styles: Record<string, string | number>): string {
    const styleEntries = Object.entries(styles)
      .map(([key, value]) => `  ${key}: ${typeof value === 'string' ? `"${value}"` : value};`)
      .join('\n');

    return `
import styled from 'styled-components';

export const StyledComponent = styled.div\`
${styleEntries}
\`;`;
  }

  generateClassName(): string {
    return ''; // CSS-in-JS doesn't use classes
  }
} 