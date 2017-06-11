const path = require('path');

module.exports = {
  root: true,

  parser: 'babel-eslint',

  extends: [
    'react-app',
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

    'import/no-named-default': 0, // travis don't like this rule
  },

  settings: {
    'import/resolver': {
      node: { paths: [path.resolve(__dirname, './src')] },
      webpack: { config: 'node_modules/react-scripts/config/webpack.config.dev.js' },
    },
  },
};
