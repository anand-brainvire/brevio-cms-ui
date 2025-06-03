module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  overrides: [],
  ignorePatterns: ['craco.config.js', '/build', '/node_modules'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true // Allows for the parsing of JSX
    }
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    eqeqeq: 'off',
    curly: 'error',
    quotes: ['error', 'single'],
    // no semicolon
    'no-empty-function': 'error',
    camelcase: 'error',
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-empty': 'error',
    'block-scoped-var': 'error',
    complexity: ['warn', 25],
    'default-case': 'error',
    strict: 'error',
    'no-eval': 'error',
    'no-redeclare': 'warn',
    'no-const-assign': 'error',
    'no-duplicate-imports': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        'args': 'all',
        'argsIgnorePattern': '^_',
        'caughtErrors': 'all',
        'caughtErrorsIgnorePattern': '^_',
        'destructuredArrayIgnorePattern': '^_',
        'varsIgnorePattern': '^_',
        'ignoreRestSiblings': true
      }
    ]
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  root: true,
};
