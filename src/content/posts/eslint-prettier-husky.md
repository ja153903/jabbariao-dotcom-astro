---
layout: ../../layouts/PostLayout.astro
title: Setting up a JS/TS projects with ESLint, Prettier, and Husky
description: DX at its finest
date: May 17, 2023
slug: eslint-config-prettier
approxTimeSpentReading: 2
---

Whenever I start a JavaScript/TypeScript project, one of the first things I set up are various devtools that
make my life easier. The most important for me to start a project are the following:

- `ESLint`
- `Prettier`
- Pre-Commit Hooks with `Husky` and `lint-staged`

## ESLint

We can use the following command to initialize our `ESLint` config

```bash
npm init @eslint/config
```

This will generate a `.eslintrc.js` file which may look like the following:

```js
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
};
```

## Prettier

Next, we want to set-up `Prettier` for formatting.

```bash
npm i -D prettier eslint-config-prettier
```

Once we do this, we should also create a `.prettierrc.js` file to set up some rules.

```js
module.exports = {
  tabWidth: 2,
  useTabs: false,
  printWidth: 80,
  semi: true,
  trailingComma: "es5",
  singleQuote: false,
};
```

To integrate `Prettier` into our `ESLint` configuration, we should include `Prettier`
as one of the plugins we extend from.

```js
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "prettier"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
};
```

## Husky and lint-staged

Lastly, I like to set up pre-commit hooks that will lint and format my code for me before I make a commit.

We can get this started with the following command:

```bash
npx husky-init && npm i
```

This will create a `.husky` directory at the base of the project. Then, let's also install `lint-staged` as follows:

```bash
npm i -D lint-staged
```

Once we have that installed, we need modify the `pre-commit` file in the `.husky` directory to run the following command:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
```

Once we modify this file, we should then update our `package.json` file to set-up our linter tasks.

```json
{
  // ... rest of package.json is omitted
  "lint-staged": {
    "**/*.{js,ts,jsx,tsx}": ["npx eslint --fix", "npx prettier --write"]
  }
}
```

## Conclusion

Since I do this every project, I'm going to leave this here as a reference because I will forget how to do this.
