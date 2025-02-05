import { Parser } from './types';
import { FigmaParser } from './figma-parser';
import { HTMLParser } from './html-parser';

export class ParserFactory {
  static createParser(input: string): Parser {
    try {
      // Try to parse as JSON first
      JSON.parse(input);
      return new FigmaParser();
    } catch {
      // If JSON parsing fails, assume it's HTML
      return new HTMLParser();
    }
  }
} 