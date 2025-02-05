import { Parser, ParsedElement, FigmaElement } from './types';

export class FigmaParser implements Parser {
  async parse(input: string): Promise<ParsedElement[]> {
    const figmaData = JSON.parse(input);
    return this.parseFigmaNode(figmaData.document);
  }

  private parseFigmaNode(node: any): FigmaElement[] {
    if (!node) return [];

    const element: FigmaElement = {
      type: node.type,
      figmaId: node.id,
      name: node.name,
      props: this.extractProps(node),
      styles: this.extractStyles(node),
      children: [],
    };

    if (node.children) {
      element.children = node.children.flatMap((child: any) => this.parseFigmaNode(child));
    }

    if (node.absoluteBoundingBox) {
      element.absoluteBoundingBox = node.absoluteBoundingBox;
    }

    return [element];
  }

  private extractProps(node: any): Record<string, any> {
    const props: Record<string, any> = {};

    if (node.characters) {
      props.text = node.characters;
    }

    if (node.onClick) {
      props.onClick = true;
    }

    // Extract other relevant properties based on node type
    switch (node.type) {
      case 'TEXT':
        props.fontSize = node.style?.fontSize;
        props.fontWeight = node.style?.fontWeight;
        break;
      case 'RECTANGLE':
      case 'FRAME':
        if (node.cornerRadius) {
          props.borderRadius = node.cornerRadius;
        }
        break;
    }

    return props;
  }

  private extractStyles(node: any): Record<string, string | number> {
    const styles: Record<string, string | number> = {};

    if (node.fills?.length > 0) {
      const fill = node.fills[0];
      if (fill.type === 'SOLID') {
        styles.backgroundColor = this.rgbToHex(fill.color);
      }
    }

    if (node.strokes?.length > 0) {
      const stroke = node.strokes[0];
      styles.borderColor = this.rgbToHex(stroke.color);
      styles.borderWidth = node.strokeWeight;
    }

    if (node.style) {
      if (node.style.fontSize) styles.fontSize = node.style.fontSize;
      if (node.style.lineHeight) styles.lineHeight = node.style.lineHeight;
      if (node.style.textAlignHorizontal) styles.textAlign = node.style.textAlignHorizontal.toLowerCase();
    }

    return styles;
  }

  private rgbToHex(color: { r: number; g: number; b: number }): string {
    const toHex = (value: number) => {
      const hex = Math.round(value * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
  }
} 