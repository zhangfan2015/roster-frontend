import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import autoImport from './.eslintrc-auto-import.json' assert { type: 'json' };

export default [
    { files: ['**/*.{js,mjs,cjs,ts,vue}'] },
    // 导入auto-import插件配置（目前暂不支持eslint9）
    { files: ['**/*.{js,mjs,cjs,ts,vue}'], languageOptions: autoImport },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    ...pluginVue.configs['flat/essential'],
    { files: ['**/*.vue'], languageOptions: { parserOptions: { parser: tseslint.parser } } },
    // 自定义规则
    {
        rules: {
            // 使用any类型时提示警告
            '@typescript-eslint/no-explicit-any': 'warn',
        },
    },
    eslintPluginPrettierRecommended,
];

