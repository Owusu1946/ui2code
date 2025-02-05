import { ParsedElement, ComponentOutput } from "../types";

export interface ComponentGenerator {
  generate(elements: ParsedElement[]): Promise<ComponentOutput[]>;
}

export interface StyleGenerator {
  generateStyles(styles: Record<string, string | number>): string;
  generateClassName(styles: Record<string, string | number>): string;
}

export interface ComponentTemplate {
  imports: string[];
  props: Record<string, string>;
  jsx: string;
  styles?: string;
} 