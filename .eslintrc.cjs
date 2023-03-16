module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    // 插件 eslint-config-prettier 相关配置
    "prettier"
  ],
  "overrides": [
    {
      // 不检查 no-unused-expressions
      "files": ["*.json", "*.cjs"],
      "rules": {
        "no-unused-expressions": "off"
      }
    }
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "@typescript-eslint",
    "simple-import-sort",

    // 插件 eslint-plugin-prettier 相关配置
    "prettier"
  ],
  "rules": {
    // 插件 eslint-plugin-simple-import-sort 相关配置
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",

    // 其他主要配置
    "@typescript-eslint/ban-types": 0,
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": 0,
    "prefer-const": "warn",
    "indent": ["error", 2],
    "no-multiple-empty-lines": 2,
    "lines-around-comment": [
      "error",
      {
        "beforeBlockComment": true,
        "afterBlockComment": true,
        "beforeLineComment": true,
        "afterLineComment": false,
        "allowBlockStart": true,
        "allowBlockEnd": true,
        "allowObjectStart": true,
        "allowObjectEnd": true,
        "allowArrayStart": true,
        "allowArrayEnd": true
      }
    ],

    
    // 插件 eslint-plugin-prettier 相关配置
    "prettier/prettier": "error"
  }
}
