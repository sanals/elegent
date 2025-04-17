// ESLint configuration for TypeScript React project
const js = require('@eslint/js');
const eslintConfigPrettier = require('eslint-config-prettier');
const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');

// Define patterns to ignore
const ignores = [
  '**/node_modules/**',
  '**/build/**',
  '**/dist/**',
  '**/coverage/**',
  '**/public/**',
  '**/.history/**',
  '**/vite.config.ts',
  '**/.eslintrc.js',
  '**/eslint.config.js'
];

// Base configuration
const baseConfig = {
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    globals: {
      React: 'readonly',
      console: 'readonly',
      document: 'readonly',
      window: 'readonly',
      navigator: 'readonly',
      process: 'readonly',
      require: 'readonly'
    }
  },
  rules: {
    // General rules
    'no-console': 'off', // Allow console statements for now
    'no-unused-vars': 'off' // TypeScript will handle this
  }
};

module.exports = [
  // Ignore files and directories
  { ignores },
  
  // Base JS config for JavaScript files
  {
    files: ['**/*.{js,jsx}'],
    ...js.configs.recommended,
    ...baseConfig
  },
  
  // TypeScript configuration
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ...baseConfig.languageOptions,
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        },
        project: './tsconfig.json'
      }
    },
    plugins: {
      '@typescript-eslint': typescriptEslint
    },
    rules: {
      ...baseConfig.rules,
      // TypeScript rules
      '@typescript-eslint/no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_', 
        caughtErrorsIgnorePattern: '^_' 
      }],
      '@typescript-eslint/no-explicit-any': 'off', // Turn off any warnings for now
    }
  },
  
  // JSX/TSX specific rules
  {
    files: ['**/*.{jsx,tsx}'],
    languageOptions: {
      globals: {
        React: 'readonly',
        JSX: 'readonly'
      }
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin
    },
    rules: {
      // React rules
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      
      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn'
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  },
  
  // Apply Prettier last to override any conflicting rules
  eslintConfigPrettier
]; 