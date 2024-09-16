// import { rules } from 'eslint-config-prettier';c
/* eslint-env node */
module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended-type-checked',
        'prettier',
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
    },
    root: true,
    rules: {
        'no-console': 'error',
        'dot-notation': 'error',
        '@typescript-eslint.io/rules/no-unsafe-call': 'off',
        '@typescript-eslint.io/rules/no-unsafe-call': 'off',
    },
};
