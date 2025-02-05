import { ComponentGenerator, StyleGenerator, ComponentTemplate } from '../types';
import { ParsedElement, ComponentOutput } from '../../types';
import { camelCase, pascalCase } from '../../utils/string-utils';

export class ReactGenerator implements ComponentGenerator {
  constructor(private styleGenerator: StyleGenerator) {}

  async generate(elements: ParsedElement[]): Promise<ComponentOutput[]> {
    return elements.map(element => this.generateComponent(element));
  }

  private generateComponent(element: ParsedElement): ComponentOutput {
    const componentName = pascalCase(element.name || element.type);
    const props = this.generateProps(element);
    const template = this.generateTemplate(element, componentName);

    return {
      name: componentName,
      code: this.assembleComponent(template),
      dependencies: template.imports
    };
  }

  private generateProps(element: ParsedElement): Record<string, string> {
    const props: Record<string, string> = {};
    
    // Add common props
    if (element.props.text) props.text = 'string';
    if (element.props.onClick) props.onClick = '() => void';
    
    // Add style-related props
    if (Object.keys(element.styles).length > 0) {
      props.className = 'string';
    }

    return props;
  }

  private generateTemplate(element: ParsedElement, componentName: string): ComponentTemplate {
    const imports = ['import React from "react"'];
    const props = this.generateProps(element);
    const className = this.styleGenerator.generateClassName(element.styles);
    
    const propsInterface = `interface ${componentName}Props {
      ${Object.entries(props).map(([key, type]) => `${key}?: ${type};`).join('\n  ')}
    }`;

    const jsxContent = this.generateJSX(element, className);
    
    return {
      imports,
      props,
      jsx: `
${propsInterface}

const ${componentName}: React.FC<${componentName}Props> = ({
  ${Object.keys(props).join(',\n  ')}
}) => {
  return (
    ${jsxContent}
  );
};

export default ${componentName};
`
    };
  }

  private generateJSX(element: ParsedElement, className: string): string {
    const tag = element.tag || 'div';
    const props: string[] = [];

    if (className) props.push(`className="${className}"`);
    if (element.props.onClick) props.push('onClick={onClick}');
    
    const propsString = props.length > 0 ? ` ${props.join(' ')}` : '';
    
    if (element.children.length === 0) {
      return `<${tag}${propsString}>${element.props.text || ''}</${tag}>`;
    }

    const childrenJSX = element.children
      .map((child: ParsedElement) => this.generateJSX(child, this.styleGenerator.generateClassName(child.styles)))
      .join('\n');

    return `<${tag}${propsString}>
      ${childrenJSX}
    </${tag}>`;
  }

  private assembleComponent(template: ComponentTemplate): string {
    return `${template.imports.join('\n')}

${template.jsx}`;
  }
} 