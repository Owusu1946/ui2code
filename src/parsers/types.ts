export interface Parser {
  parse(input: string): Promise<ParsedElement[]>;
}

export interface ParsedElement {
  type: string;
  tag?: string;
  props: Record<string, any>;
  children: ParsedElement[];
  styles: Record<string, string | number>;
}

export interface FigmaElement extends ParsedElement {
  figmaId: string;
  name: string;
  absoluteBoundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
} 