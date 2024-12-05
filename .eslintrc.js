module.exports = {
    env: {
      node: true,
      es6: true,
      mocha: true
    },
    extends: [
      'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
      'plugin:prettier/recommended',
      'eslint-config-dsbs'
    ],
    rules: {
      '@typescript-eslint/no-use-before-define': 0,
      '@typescript-eslint/no-explicit-any': 0,
      '@typescript-eslint/no-non-null-assertion': 0,
      '@typescript-eslint/ban-ts-ignore': 0,
      '@typescript-eslint/camelcase': 0,
      '@typescript-eslint/class-name-casing': 0,
      '@typescript-eslint/interface-name-prefix': 0,
      '@typescript-eslint/explicit-function-return-type': 1,
      '@typescript-eslint/no-var-requires': 0,
      'no-console': 1,
      'no-undef': 'off',
      'no-constant-condition': 'off',
      '@typescript-eslint/no-unused-vars': 0
    }
  };
  