module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'turbo',
    'eslint-config-prettier',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react', '@typescript-eslint', 'jsx-a11y', 'react-hooks'],
  rules: {
    'no-unused-vars': 'warn',
    'react/react-in-jsx-scope': 0,
    'no-constant-condition': [2, { checkLoops: false }],
    'no-cond-assign': [2],
    'prefer-spread': [1],
    'react/prop-types': 'off',
    semi: [1],
    'react-hooks/exhaustive-deps': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 0, // TODO: remove this later
    'jsx-a11y/click-events-have-key-events': 'warn', // TODO: remove this later
    'jsx-a11y/no-static-element-interactions': 'warn', // TODO: remove this later
    'jsx-a11y/img-redundant-alt': 'error'
  },
};
