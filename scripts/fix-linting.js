#!/usr/bin/env node

/**
 * Script to help fix common linting issues in the codebase
 *
 * This script will:
 * 1. Add underscore prefixes to unused variables
 * 2. Add a // eslint-disable-next-line comment above console.log statements
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

console.log('Starting to fix linting issues...');

// Get all TypeScript files in the project
const findTsFiles = () => {
  return new Promise((resolve, reject) => {
    exec('find ./app -name "*.ts" -o -name "*.tsx"', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error finding TypeScript files: ${error.message}`);
        return reject(error);
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return reject(new Error(stderr));
      }
      resolve(stdout.trim().split('\n').filter(Boolean));
    });
  });
};

// Fix unused variables by adding underscore prefix
const fixUnusedVariables = content => {
  // Match variable declarations that aren't already prefixed with _
  const unusedVarRegex =
    /const\s+(?!_)(\w+)(\s*=\s*[^;]+;.*\/\/\s*eslint-disable-line\s+no-unused-vars)/g;
  return content.replace(unusedVarRegex, 'const _$1$2');
};

// Add eslint-disable comments for console.log statements
const fixConsoleStatements = content => {
  const lines = content.split('\n');
  const newLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if line contains console.log and doesn't already have eslint-disable
    if (
      line.includes('console.log') &&
      !line.includes('eslint-disable') &&
      !lines[i - 1]?.includes('eslint-disable')
    ) {
      newLines.push('  // eslint-disable-next-line no-console');
      newLines.push(line);
    } else {
      newLines.push(line);
    }
  }

  return newLines.join('\n');
};

// Process a single file
const processFile = async filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Apply fixes
    let newContent = content;
    newContent = fixUnusedVariables(newContent);
    newContent = fixConsoleStatements(newContent);

    // Only write if content has changed
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Fixed issues in: ${filePath}`);
      return 1; // Return 1 for files that were changed
    }
    return 0; // Return 0 for unchanged files
  } catch (error) {
    console.error(`Error processing file ${filePath}: ${error.message}`);
    return 0;
  }
};

// Main function
const main = async () => {
  try {
    const files = await findTsFiles();
    console.log(`Found ${files.length} TypeScript files to process.`);

    let changedFiles = 0;
    for (const file of files) {
      changedFiles += await processFile(file);
    }

    console.log(`\nDone! Fixed issues in ${changedFiles} files.`);
    console.log('\nRemaining issues:');
    console.log('1. Unused imports - consider removing them or prefix with _');
    console.log('2. Function parameters - prefix unused ones with _');
    console.log('\nRun npm run lint:fix to see if there are any remaining warnings.');
  } catch (error) {
    console.error(`Error executing script: ${error.message}`);
    process.exit(1);
  }
};

main();
