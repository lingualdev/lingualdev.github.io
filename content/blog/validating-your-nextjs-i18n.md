+++
title = "i18n-check: Validating your Next.js internationalization"
date = 2025-06-21
slug = "validating-your-nextjs-internationalization"
tags = ["i18n", "i18next", "React", "next-i18next", "next=intl", "nextjs"]
summary = "i18n-check has better support for next.js applications now, including being able to support the next-intl and next-i18next libraries. Use i18n-check to validate a next.js application end to end, including being able to identify missing keys in locales files and missing translations in the source language as well as unused keys in the source-code."
+++

## Introduction

In the previous [i18n-check: End to end React i18n testing](https://lingual.dev/blog/i18n-check-end-to-end-react-i18n-testing/) post we went into detail on how a **React** application can be validated in regards to **i18n**. [i18n-check](https://github.com/lingualdev/i18n-check) now also supports `next-intl` and also works with `next-i18next` out of the box, offering more options in regards to validating **Next.js** applications.

With the latest changes it's now possible to validate i18n end to end for a Next.js application if one of the following i18n libraries is used: [`react-intl`](https://formatjs.github.io/docs/react-intl/), [`react-i18next`](https://github.com/i18next/react-i18next), [`next-intl`](https://next-intl.dev/) or [`next-i18next`](https://github.com/i18next/next-i18next)

This enables to find **untranslated** or **invalid** translation messages in locale files and additionally also find **undefined** keys, that exist in the source code but not in the locales files, as well as **unused** keys, that exist in the locale files but not in the source code.

### Checking i18n in a Next.js application

Running checks should help with being able to answer the following questions:

> How many keys are missing in the `fr` target language file?

> Are all keys valid in the `de` target file?

> Are there any keys in the codebase that are missing in the `en` source language file?

Take a look at the following example:

```json
// en.json
"message.greeting": "Hi, <b>{name}</b>!"

// de.json
"message.greeting": "Hallo {name}!"
```

While the default message contains tags, the message in the `de.json` file does not. These tags could have been removed during the translation process or were never added in the first place, causing a mismatch between the source and target language message.

```json
// en.json
"message.greeting": "Hi {user}, it is {today, date, medium}.",

// de.json
"message.greeting": "Hallo {user}, heute ist {today, date, medium} und morgen ist {tomorrow, date, medium}.",
```

The second example shows that the target translation contains more date information when compared to the source `en.json` file, which means that the source and target translations are out of sync, which can lead to weird display errors at runtime.

Running these i18n checks should help us to identify any potential runtime issues before they affect users. We don't want to actively think about the state of our translations and rather be informed when something is missing or needs updating.

## Setting up i18n-check

To set up i18n-check run the following command:

```bash
yarn add --dev @lingual/i18n-check
```

Alternatively if you are using npm:

```bash
npm install --save-dev @lingual/i18n-check
```

Or if you are using pnpm:

```bash
pnpm add --save-dev @lingual/i18n-check
```

Update the `package.json` file and add a new command:

```json
"scripts": {
    // ...
    "i18n:check": "i18n-check"
}
```

Run the `i18n:check` command directly from the CLI, i.e. `yarn i18n:check`.

## Validating locale and source files

Checks can run against single files, single folders or a combination of files and folders. Depending on how these localization files are organized, there are multiple possible ways to run the checks.

In the following is a basic example to get a better understanding (there are more advanced scenarios in the [README](https://github.com/lingualdev/i18n-check?tab=readme-ov-file#examples)). A basic setup could for example include a folder called _locales_ containing a number of translation files organized as `en-en.json`, `fr-fr.json`, `it-it.json` etc:

```
- locales/
  - en-en.json
  - fr-fr.json
  - it-it.json
```

Using the `-l` or `--locales` option you define where the target locale files are located and with the `-s` or `--source` option you can specify the base/reference file / folder to compare the target files against. To define where the source files are located you can use the `-u` or `--unused` option and also provide the `-f` or `--format`to tell the parser if we need to check for `react-intl`, `next-intl` or the `i18-next` format.

```bash
yarn i18n:check --locales locales --source en-en -f next-intl -u src
```

The above command would yield the following result:

```bash
i18n translations checker
Source: en-en

Found missing keys!
┌──────────────────────────────┬────────────┐
│ file                         │ key        │
├──────────────────────────────┼────────────┤
│  messageExamples/de-de.json  │  richText  │
│  messageExamples/de-de.json  │  nesting1  │
│  messageExamples/de-de.json  │  key1      │
└──────────────────────────────┴────────────┘

Found invalid keys!
┌──────────────────────────────┬─────────────────────┐
│ file                         │ key                 │
├──────────────────────────────┼─────────────────────┤
│  messageExamples/de-de.json  │  multipleVariables  │
└──────────────────────────────┴─────────────────────┘

Found unused keys!
┌─────────────────────────────────────────────────┬──────────────────┐
│ file                                            │ key              │
├─────────────────────────────────────────────────┼──────────────────┤
│  messageExamples/en-en.json                     │  format.ebook    │
│  messageExamples/en-en.json                     │  nonExistentKey  │
└─────────────────────────────────────────────────┴──────────────────┘

Found undefined keys!
┌──────────────────────────────────────────────────────┬────────────────────────────────┐
│ file                                                 │ key                            │
├──────────────────────────────────────────────────────┼────────────────────────────────┤
│  src/App.tsx                                         │  some.key.that.is.not.defined  │
└──────────────────────────────────────────────────────┴────────────────────────────────┘
```

For more advanced examples check the [examples section in the README](https://github.com/lingualdev/i18n-check?tab=readme-ov-file#examples).

## Setup checks on the CI

The following is an example of how you could define a **Github workflow** for an existing Next.js application, where the source code to parse is under `src`.

```yml
name: i18n-check
on:
  pull_request:
    branches:
      - main
  push:
    branches:
      - main

jobs:
  i18n-check:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@master

      - name: yarn install & build
        run: |
          yarn install
          yarn build

      - name: yarn i18n-check
        run: |
          yarn i18n:check -l translations/messageExamples -s en-US -u src/ -f next-intl
```

Checkout i18n-check [here](https://github.com/lingualdev/i18n-check)

## Links

- [i18n-check](https://github.com/lingualdev/i18n-check)
- [react-intl](https://formatjs.github.io/docs/react-intl/)
- [react-i18next](https://github.com/i18next/react-i18next)
- [next-intl](https://next-intl.dev/)
- [next-i18next](https://github.com/i18next/next-i18next)
- [Bluesky](https://bsky.app/profile/lingualdev.bsky.social)
- [Twitter](https://twitter.com/lingualdev)
