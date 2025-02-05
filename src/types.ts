export interface ConversionOptions {
  input: string;
  framework: 'react' | 'vue';
  styling: 'tailwind' | 'css-in-js';
  output: string;
}

export interface FigmaNode {
  id: string;
  name: string;
  type: string;
  // Add more Figma node properties as needed
}

export interface ComponentOutput {
  name: string;
  code: string;
  dependencies: string[];
}

export interface ParsedElement {
  type: string;
  tag?: string;
  name?: string;
  props: Record<string, any>;
  children: ParsedElement[];
  styles: Record<string, string | number>;
} 