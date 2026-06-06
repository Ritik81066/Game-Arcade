import eslintPluginReact from 'eslint-plugin-react'

export default [
  {
    ignores: ['dist', 'node_modules']
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        browser: true,
        es2021: true,
        node: true,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      react: eslintPluginReact
    },
    rules: {
      'react/react-in-jsx-scope': 'off'
    }
  }
]
