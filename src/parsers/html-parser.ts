import { Parser, ParsedElement } from './types';
import { parse, HTMLElement } from 'node-html-parser';

export class HTMLParser implements Parser {
  async parse(input: string): Promise<ParsedElement[]> {
    const root = parse(input);
    return this.parseNode(root.childNodes as HTMLElement[]);
  }

  private parseNode(nodes: HTMLElement[]): ParsedElement[] {
    return nodes
      .filter(node => node.nodeType === 1) // Filter for element nodes
      .map(node => {
        const element: ParsedElement = {
          type: 'HTML_ELEMENT',
          tag: node.tagName.toLowerCase(),
          props: this.extractProps(node),
          styles: this.extractStyles(node),
          children: [],
        };

        if (node.childNodes && node.childNodes.length > 0) {
          element.children = this.parseNode(node.childNodes as HTMLElement[]);
        }

        return element;
      });
  }

  private extractProps(node: HTMLElement): Record<string, any> {
    const props: Record<string, any> = {};

    // Extract attributes
    const attributes = node.attributes;
    Object.keys(attributes).forEach(key => {
      if (key !== 'style' && key !== 'class') {
        props[key] = attributes[key];
      }
    });

    // Extract data attributes
    Object.keys(attributes)
      .filter(key => key.startsWith('data-'))
      .forEach(key => {
        props[key] = attributes[key];
      });

    // Extract text content
    const text = node.text.trim();
    if (text) {
      props.text = text;
    }

    return props;
  }

  private extractStyles(node: HTMLElement): Record<string, string | number> {
    const styles: Record<string, string | number> = {};
    const styleAttr = node.getAttribute('style');

    if (!styleAttr) return styles;

    // Parse inline styles
    styleAttr.split(';').forEach((style: string) => {
      const [property, value] = style.split(':').map(s => s.trim());
      if (property && value) {
        // Convert kebab-case to camelCase
        const camelProperty = property.replace(/-([a-z])/g, (_, group) => group.toUpperCase());
        styles[camelProperty] = value;
      }
    });

    return styles;
  }
} 