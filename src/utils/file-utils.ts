import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { ComponentOutput } from '../types';
import prettier from 'prettier';

export class FileUtils {
  static async writeComponent(
    component: ComponentOutput,
    outputDir: string,
    framework: 'react' | 'vue'
  ): Promise<void> {
    const extension = framework === 'react' ? 'tsx' : 'vue';
    const fileName = `${component.name}.${extension}`;
    const filePath = join(outputDir, fileName);

    // Create output directory if it doesn't exist
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    // Format the code using prettier
    const formattedCode = await this.formatCode(component.code, extension);

    // Write the file
    writeFileSync(filePath, formattedCode, 'utf-8');
  }

  static async writeComponents(
    components: ComponentOutput[],
    outputDir: string,
    framework: 'react' | 'vue'
  ): Promise<void> {
    // Create index file content
    const indexContent = this.generateIndexFile(components, framework);
    
    // Write each component
    for (const component of components) {
      await this.writeComponent(component, outputDir, framework);
    }

    // Write index file
    const indexExtension = framework === 'react' ? 'ts' : 'ts';
    const indexPath = join(outputDir, `index.${indexExtension}`);
    const formattedIndex = await this.formatCode(indexContent, indexExtension);
    writeFileSync(indexPath, formattedIndex, 'utf-8');
  }

  private static generateIndexFile(
    components: ComponentOutput[],
    framework: 'react' | 'vue'
  ): string {
    const exports = components
      .map(component => `export { default as ${component.name} } from './${component.name}';`)
      .join('\n');

    return exports;
  }

  private static async formatCode(code: string, extension: string): Promise<string> {
    try {
      return await prettier.format(code, {
        parser: extension === 'vue' ? 'vue' : 'typescript',
        semi: true,
        singleQuote: true,
        trailingComma: 'es5',
      });
    } catch (error) {
      console.warn('Failed to format code:', error);
      return code;
    }
  }
} 