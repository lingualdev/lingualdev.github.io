+++
title = "i18n-check: End to end React i18n testing"
date = 2025-03-29
slug = "i18n-check-end-to-end-react-i18n-testing"
tags = ["react", "i18n", "react-intl", "i18next", "react-i18next", "testing"]
summary = "i18n-check can be used to test your React internalization end to end and ensure all your i18n efforts are up to date. Aside from simple comparisons between the source and target language files, i18n-check can also find missing or unused translation keys in your source code. Running these checks on the CI can help to gain more insight on the current i18n state and highlight areas were improvements are needed."
+++

## Introduction

[i18n-check](https://github.com/lingualdev/i18n-check) was created to help with general internationalization efforts and originally focused on finding **untranslated** or **invalid** translation messages. While finding differences between locale files is useful, there is another important aspect that an end to end testing tool needs cover: the actual codebase.

While the locale files can be based on a specific format, i.e. `ICU` messages, the codebase is coupled to a specific programming language and/or framework. So the **general locale file checks can be applied to a broader range of languages and frameworks** (as long as they generate a valid file), but this approach doesn't work for when needing to parse and understand the codebase.

To summarize the above situation: `i18n-check` can be used to validate any locale files based on the `ICU` or `i18next` format, but also enables to **test your React application end to end**, as it supports code analysis of `react-intl` and `react-i18next` codebases.

In the following we want to focus on how to test your React application and highlight some of the benefits that come with taking this approach, especially if you are not using any translation management system.

### React and i18n

With React, there are a large number of available **i18n libraries** that help with internationalizing your application and in this post we will focus on the two most widely used libraries: [react-intl](https://formatjs.io/docs/react-intl/) and [react-i18next](https://react.i18next.com/).

Both libraries offer the capability to use extraction tools for generating the default locale JSON file, based on the currently defined translation keys in the codebase. The main advantage of choosing an extraction tool, aside of not having to manually update the source locale files, is that any i18n related changes (creating/updating/removing keys) are reflected in the JSON files. This means the source locale files are already in sync with the codebase.

Even if it's viable to use extraction tools, there is still the scenario that **the source and target local files can be out of sync**. Without a translation management system, there might **not be an overview of the current state of these target languages**.

Starting from the above described scenario, `i18n-check` wants to enable to answer the following questions:

> How many keys are missing in the `fr` target language file?

> Are all keys valid in the `de` target file?

> Are there any keys in the codebase that are missing in the `en` source language file?

> Are there any keys in the `en` source file that do not exist in the codebase?

Just by looking at the above questions, it's clear that keeping your i18n efforts up to date is a non trivial task - and there are multiple areas where something might go wrong or get out of sync.

As developers we are dealing with the actual codebase, source and target language locale files and maybe even with external translation management systems that also update locale files at some point in time.

**From a developer perspective we want tooling that we can run at a given moment in time and get a quick understanding where we might have to apply changes before running into i18n related runtime errors.**

### Using checks for end to end testing translations

Verifying any missing keys is more simple to understand, as they either exist in the target language files or not, but the situation is a little different when it comes to detecting and finding **invalid/broken keys**. There are multiple situations where a key can be in an invalid state, like invalid or missing time or date formats and messages that include pluralisation, currency or html tag mismatches.

To get a better idea, take a look at the following translations for example:

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

The second example shows that the target translation contains more date information when compared to the source `en.json` file, which means that the source and target translations are out of sync, leading to weird display errors at runtime.

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

i18n-check can either be accessed via defining a command in the `package.json` file or directly in the CLI after running the installation command.

Now update the `package.json` file and add a new command:

```json
"scripts": {
    // ...other commands,
    "i18n:check": "i18n-check"
}
```

Run the `i18n:check` command directly from the command-line, i.e. `yarn i18n:check`.

Alternatively you can also access the library directly:

```bash
node_modules/.bin/i18n-check
```

## Running checks against locale and source files

Once you have everything set up, you can run `check` commands against single files, single folders or a combination of files and folders. There are a number of possible check scenarios and these depend on how the localization files are structured in your codebase.

We can take a look at a possible scenario (there are more advanced scenarios in the [README](https://github.com/lingualdev/i18n-check?tab=readme-ov-file#examples)). A basic setup could include a folder called _locales_ containing a number of translation files organized as `en-en.json`, `fr-fr.json`, `it-it.json` etc:

```
- locales/
  - en-en.json
  - fr-fr.json
  - it-it.json
```

You can use the `-l` or `--locales` option to define the directory that contains the target files and with the `-s` or `--source` option you can specify the base/reference file to compare the target files against.

```bash
yarn i18n:check --locales locales --source en-en
```

In the above scenario the `i18n-check` will compare the `fr-fr.json` and `it-it.json` file against the `en-en.json` file and check for any missing or broken keys. Running the above command would return the following result:

```bash
i18n translations checker
Source: en-en

Found missing keys!
┌──────────────────────────────┬────────────┐
│ file                         │ key        │
├──────────────────────────────┼────────────┤
│  messageExamples/de-de.json  │  richText  │
│  messageExamples/de-de.json  │  yo        │
│  messageExamples/de-de.json  │  nesting1  │
│  messageExamples/de-de.json  │  nesting2  │
│  messageExamples/de-de.json  │  nesting3  │
│  messageExamples/de-de.json  │  key1      │
└──────────────────────────────┴────────────┘

Found invalid keys!
┌──────────────────────────────┬─────────────────────┐
│ file                         │ key                 │
├──────────────────────────────┼─────────────────────┤
│  messageExamples/de-de.json  │  multipleVariables  │
└──────────────────────────────┴─────────────────────┘
```

You can also use the `-r` or `--reporter` option to see a summary of the check instead of single keys, this is especially useful if you do not want to list all the keys:

```bash
i18n translations checker
Source: en-en

Found missing keys!
┌──────────────────────────────┬───────┐
│ file                         │ total │
├──────────────────────────────┼───────┤
│  messageExamples/de-de.json  │ 6     │
└──────────────────────────────┴───────┘

Found invalid keys!
┌──────────────────────────────┬───────┐
│ file                         │ total │
├──────────────────────────────┼───────┤
│  messageExamples/de-de.json  │ 1     │
└──────────────────────────────┴───────┘
```

Next, we can extend the above command to also run against the source files and check for the i18n keys in the codebase and compare them to the keys defined in the locale files. For that we need to define where to source files are located, which we can do via the `-u` or `--unused` flag and also provide the `-f` or `--format`to tell the parser if we need to check for `react-intl` or `i18-next` format.

```bash
yarn i18n:check --locales locales --source en-en -f i18next -u src
```

```bash
i18n translations checker
Source: en-en

Found missing keys!
┌──────────────────────────────┬────────────┐
│ file                         │ key        │
├──────────────────────────────┼────────────┤
│  messageExamples/de-de.json  │  richText  │
│  messageExamples/de-de.json  │  yo        │
│  messageExamples/de-de.json  │  nesting1  │
│  messageExamples/de-de.json  │  nesting2  │
│  messageExamples/de-de.json  │  nesting3  │
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

Check the [examples section in the README](https://github.com/lingualdev/i18n-check?tab=readme-ov-file#examples) for more advanced scenarios.

There are also a number of additional options available to configure the check even further. For example you can only check for missing keys or only check for broken/invalid translations via the `--check` option.

## Usage

`i18n-check` can be incorporated into your existing workflow in different ways, f.e. running the checks manually on the CLI or adding it as a pre-commit hook. Furthermore you can run these end to end checks on the CI. The following is an example of how you could define a **Github workflow** for an i18next codebase, where the codebase to parse is under `src`.

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
          yarn i18n:check -l translations/messageExamples -s en-US -u src/ -f react-intl
```

### What's planned next

We have a couple more features planned, that we want add to `i18n-check` in upcoming versions. The most interesting ones include showing error messages, to help with fixing invalid or broken messages and showing translations that exist in target languages, but are non existent in the source locale.

Other plans include extending the unused keys/undefined keys check to other frameworks aside React, mainly focusing on the JavaScript eco-system as a first step.

Finally we might try to add VS Code plugin, to enable run the checks directly inside your IDE and getting some visual feedback on the state of your translations.

You can give i18n-check a try today and see if the checks can help improve your localization efforts, especially if you are not using a third party SaaS solution for the translation part (as these often come with helpful information in regards to the state of your localization efforts).

Checkout i18n-check [here](https://github.com/lingualdev/i18n-check)

## Links

- [i18n-check](https://github.com/lingualdev/i18n-check)
- [Bluesky](https://bsky.app/profile/lingualdev.bsky.social)
- [Twitter](https://twitter.com/lingualdev)
