module.exports = {
  extends: ['universe/native'],
  rules: {
    // Allow console logs in development
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // Make unused vars more permissive
    'no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
  },
  // This enables eslint to find React components
  settings: {
    react: {
      version: 'detect',
    },
  },
};
