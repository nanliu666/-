module.exports = {
  globals: {
    _: 'readonly'
  },
  root: true,
  env: {
    node: true
  },
  extends: ['eslint:recommended', 'plugin:vue/recommended'],
  rules: {
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-prototype-builtins': 'off',
    semi: [2, 'never'],
    quotes: ['error', 'single'],
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: 20,
        multiline: {
          max: 20,
          allowFirstLine: true
        }
      }
    ],
    'vue/html-self-closing': 'off',
    'max-len': [
      0,
      {
        code: 920
      }
    ]
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
