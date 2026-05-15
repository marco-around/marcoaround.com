import { defineConfig } from 'eslint/config'
import eslintPluginAstro from 'eslint-plugin-astro'
import eslintPluginReactHooks from 'eslint-plugin-react-hooks'
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort'
import typescriptEslint from 'typescript-eslint'

export default defineConfig([
	{ ignores: ['dist/**', '.astro/**', 'node_modules/**'] },

	...typescriptEslint.configs.recommended,
	...eslintPluginAstro.configs.recommended,

	{
		files: ['**/*.astro'],
		languageOptions: {
			parserOptions: {
				parser: typescriptEslint.parser,
				extraFileExtensions: ['.astro'],
			},
		},
	},

	{
		files: ['**/*.{js,jsx,ts,tsx}'],
		plugins: {
			'react-hooks': eslintPluginReactHooks,
			'simple-import-sort': eslintPluginSimpleImportSort,
		},
		rules: {
			...eslintPluginReactHooks.configs.recommended.rules,
			'simple-import-sort/imports': 'error',
		},
	},
])
