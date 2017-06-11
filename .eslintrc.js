const path = require('path');

module.exports = {
  root: true,

  parser: 'babel-eslint',

  extends: [
    'airbnb',
    'prettier',
    'prettier/flowtype',
    'prettier/react',
  ],

  plugins: [
    'prettier',
  ],

  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jest: true,
    node: true,
  },

  rules: {
    'prettier/prettier': ['error', {
      'printWidth': 80,
      'singleQuote': true,
      'trailingComma': 'es5',
    }],
    'class-methods-use-this': 0,
    'react/jsx-filename-extension': 0,
    'react/require-default-props': 0,
    'react/forbid-prop-types': 0,
    'react/no-unused-prop-types': 0,
    'react/no-unescaped-entities': 0,
    'import/no-named-default': 0, // travis don't like this rule

    'import/no-extraneous-dependencies': 0,
    'react/no-array-index-key': 0,
    'import/extensions': [2, 'always', { 'js': 'never' }],
  },

  settings: {
    'import/resolver': {
      node: { paths: [path.resolve(__dirname, './src')] },
      webpack: { config: 'node_modules/react-scripts/config/webpack.config.dev.js' },
    },
  },
};
