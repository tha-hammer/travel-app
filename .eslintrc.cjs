module.exports = {
  root: true,
  env: { es6: true, node: true, jest: true },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint','import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  settings: {
    'import/resolver': {
      node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
      typescript: {},
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'import/no-restricted-paths': ['error', {
      zones: [
        { target: './app/views', from: './app/services', message: 'Views must not import Services directly. Use controllers.' },
        { target: './app/views', from: './app/models', message: 'Views must not import Models directly. Use controllers.' },
        { target: './app/controllers', from: './app/views', message: 'Controllers must not depend on Views.' },
        { target: './app/models', from: './app/controllers', message: 'Models must be pure and not depend on Controllers.' },
        { target: './app/models', from: './app/services', message: 'Models must be pure and not depend on Services.' },
      ],
    }],
  },
};
