import { ComponentGenerator, ComponentTemplate, StyleGenerator } from '../types';
import { ParsedElement, ComponentOutput } from '../../types';
import { camelCase, pascalCase } from '../../utils/string-utils';

export class VueGenerator implements ComponentGenerator {
  constructor(private styleGenerator: StyleGenerator) {}

  async generate(elements: ParsedElement[]): Promise<ComponentOutput[]> {
    return elements.map(element => this.generateComponent(element));
  }

  private generateComponent(element: ParsedElement): ComponentOutput {
    const componentName = pascalCase(element.name || element.type);
    const template = this.generateTemplate(element);

    return {
      name: componentName,
      code: this.assembleComponent(template, componentName),
      dependencies: template.imports
    };
  }

  private generateTemplate(element: ParsedElement): ComponentTemplate {
    const imports: string[] = [];
    const props = this.generateProps(element);
    const className = this.styleGenerator.generateClassName(element.styles);
    
    return {
      imports,
      props,
      jsx: this.generateVueTemplate(element, className)
    };
  }

  private generateProps(element: ParsedElement): Record<string, string> {
    const props: Record<string, string> = {};
    
    if (element.props.text) props.text = 'String';
    if (element.props.onClick) props.onClick = 'Function';
    
    return props;
  }

  private generateVueTemplate(element: ParsedElement, className: string): string {
    const tag = element.tag || 'div';
    const props: string[] = [];

    if (className) props.push(`class="${className}"`);
    if (element.props.onClick) props.push('@click="onClick"');
    
    const propsString = props.length > 0 ? ` ${props.join(' ')}` : '';
    
    if (element.children.length === 0) {
      return `<${tag}${propsString}>${element.props.text || ''}</${tag}>`;
    }

    const childrenTemplate = element.children
      .map(child => this.generateVueTemplate(child, this.styleGenerator.generateClassName(child.styles)))
      .join('\n');

    return `<${tag}${propsString}>
      ${childrenTemplate}
    </${tag}>`;
  }

  private assembleComponent(template: ComponentTemplate, componentName: string): string {
    const propsDefinition = Object.entries(template.props)
      .map(([key, type]) => `${key}: ${type}`)
      .join(',\n');

    return `<template>
  ${template.jsx}
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: '${componentName}',
  props: {
    ${propsDefinition}
  }
})
</script>`;
  }
} 