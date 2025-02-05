import { readFileSync } from 'fs';
import { ConversionOptions } from './types';
import { ParserFactory } from './parsers/parser-factory';
import { ReactGenerator } from './generators/react/react-generator';
import { VueGenerator } from './generators/vue/vue-generator';
import { TailwindGenerator } from './generators/styles/tailwind-generator';
import { CSSInJSGenerator } from './generators/styles/css-in-js-generator';
import { FileUtils } from './utils/file-utils';

export async function convert(options: ConversionOptions): Promise<void> {
  const { input, framework, styling, output } = options;
  
  console.log('Options received:', options);
  
  if (!input) {
    throw new Error('Input file path is required');
  }

  // Read input file
  const inputContent = readFileSync(input, 'utf-8');
  
  // Create appropriate parser and parse input
  const parser = ParserFactory.createParser(inputContent);
  const parsedElements = await parser.parse(inputContent);
  
  // Create style generator
  const styleGenerator = styling === 'tailwind' 
    ? new TailwindGenerator()
    : new CSSInJSGenerator();

  // Create component generator
  const componentGenerator = framework === 'react'
    ? new ReactGenerator(styleGenerator)
    : new VueGenerator(styleGenerator);

  // Generate components
  const components = await componentGenerator.generate(parsedElements);

  // Write components to files
  await FileUtils.writeComponents(components, output, framework);
} 