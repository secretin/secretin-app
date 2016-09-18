module.exports = {
  root: true,

  parser: 'babel-eslint',

  extends: 'airbnb',

  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jest: true,
    node: true
  },

  rules: {
    'class-methods-use-this': 0,
    'react/jsx-filename-extension': 0,
    'import/no-unresolved': 0,
    'import/no-extraneous-dependencies': 0,
  },
};
