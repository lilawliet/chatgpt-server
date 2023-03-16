## fastify + typescript + json-schema-to-ts + eslint + prettier

(init)[https://www.fastify.io/docs/latest/Reference/TypeScript/]

```
npm init -y
npm i fastify
npm i -D typescript @types/node

...
npx tsc --init

...
npm i -D json-schema-to-ts

...
# tsconfig.json
"baseUrl": "./",
"paths": {
  "@/*": ["src/*"]
}

```

(eslint)[https://eslint.org/docs/latest/use/getting-started]
(eslint-plugin-simple-import-sort)[https://github.com/lydell/eslint-plugin-simple-import-sort/]
(prettier)[https://prettier.io/docs/en/install.html]
(eslint-config-prettier)[https://github.com/prettier/eslint-config-prettier#installation]

```
# https://eslint.org/docs/latest/use/getting-started
npm init @eslint/config
npm init @eslint/config -- --config semistandard

...
# https://github.com/lydell/eslint-plugin-simple-import-sort/
npm install --save-dev eslint-plugin-simple-import-sort

...
# https://prettier.io/docs/en/install.html
npm install --save-dev --save-exact prettier


...
# (配置关闭 eslint 与 pretter 冲突的规则) https://github.com/prettier/eslint-config-prettier#installation 
npm install --save-dev eslint-config-prettier

...
# (如果出现 prettier 不符合代码会报 eslint 错误)https://github.com/prettier/eslint-config-prettier#installation
npm install --save-dev eslint-config-prettier

...
# .vscode/settings.json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}

...
# package.json
  "scripts": {
    ...
    "_lint": "eslint \"src/**/*.{js,json,md,ts}\"",
    "_lint:fix": "eslint --fix \"src/**/*.{js,json,md,ts}\"",
    "_prettier": "prettier --write \"src/**/*.{js,json,md,ts}\""
  }
```
