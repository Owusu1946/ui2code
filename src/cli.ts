#!/usr/bin/env node

import { Command } from 'commander';
import { convert } from './converter';
import chalk from 'chalk';

const program = new Command();

program
  .name('ui2code')
  .description('Convert Figma designs and HTML to React/Vue components')
  .version('0.1.0');

program
  .command('convert')
  .description('Convert Figma design or HTML to React/Vue component')
  .option('-i, --input <path>', 'Input file path (Figma JSON or HTML)')
  .option('-f, --framework <framework>', 'Target framework (react/vue)', 'react')
  .option('-s, --styling <styling>', 'Styling method (tailwind/css-in-js)', 'tailwind')
  .option('-o, --output <path>', 'Output directory path', './output')
  .action(async (options) => {
    try {
      await convert(options);
      console.log(chalk.green('✨ Conversion completed successfully!'));
    } catch (error) {
      console.error(chalk.red('Error:'), error instanceof Error ? error.message : 'Unknown error occurred');
      process.exit(1);
    }
  });

program.parse(); 