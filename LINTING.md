# Linting Guidelines

## Overview

This project uses ESLint with the `eslint-config-universe` preset, which is optimized for React Native and Expo projects. The configuration is designed to help catch common issues while being flexible enough for development.

## Current Setup

- **ESLint**: Using ESLint v8.x with universe/native preset
- **Prettier**: For consistent code formatting
- **Custom Rules**: 
  - Console statements are allowed during development but will be errors in production
  - Unused variables are warned about but won't block development

## How to Run Linting

```bash
# Format code and fix linting issues
npm run lint:fix

# Just check for issues without fixing
npm run lint
```

## Fixing Common Warnings

We have a helper script that can automatically fix some common issues:

```bash
node scripts/fix-linting.js
```

### Manually Fixing Remaining Warnings

1. **Unused Imports/Variables**:
   - Prefix with underscore: `import { Component } from 'package'` → `import { _Component } from 'package'`
   - For function parameters: `function method(param)` → `function method(_param)`
   - Or remove if definitely not needed

2. **Console Statements**:
   - Consider removing debug console.log statements before production
   - Add eslint-disable comments if they're critical: `// eslint-disable-next-line no-console`

## Rationale

- We're using ESLint warnings rather than errors for development convenience
- In a production build, the stricter rules will apply 
- This approach allows for more efficient development without breaking the app

## Before Committing Code

Run `npm run lint:fix` to ensure your code is formatted consistently and major issues are addressed. 