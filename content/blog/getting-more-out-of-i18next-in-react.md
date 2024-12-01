+++
title = "Getting more out of i18next in React"
date = 2024-12-01
slug = "getting-more-out-of-i18next-in-react"
tags = ["i18n", "i18next", "React", "react-i18next"]
summary = "A collection of  tips and tricks to get more out of i18next and react-i18next when using it with your application or website. This post covers a wide range of topics, including pluralization, React components, hooks, validation, TypeScript and much more."
+++

## Introduction

There are a wide range of features and capabilities available to simplify the process when internationalizing your React application with `i18next`. The React specific library [`react-i18next`](https://react.i18next.com/) enables a React app to use i18next with specific hooks and components.

In this post we will look into what **advanced features** are available. This write-up assumes that you have a React application with i18next installed, otherwise consult the [documentation](https://react.i18next.com/guides/quick-start) on how to get started.

## Content

- [Handling pluralization](#handling-pluralization)
- [Using namespaces](#using-namespaces)
- [Using defaults and fallbacks](#using-defaults-and-fallbacks)
- [Using useTranslation](#using-usetranslation)
- [Using the Trans component](#using-the-trans-component)
- [Using context](#using-context)
- [Using TypeScript](#using-typescript)
- [Using ICU with i18next](#using-icu-with-i18next)
- [Working with dynamic keys](#working-with-dynamic-keys)
- [Extracting keys](#extracting-keys)
- [Validating translations](#validating-translations)

## Handling pluralization

By default i18next handles [pluralization](https://www.i18next.com/translation-function/plurals) to enable to display the correct plurals of words depending on the language.

The plural forms have to be specified in the JSON file so that i18next can display the correct representation of the word.

```json
// locales/en.json
{
  "entry_zero": "no entries",
  "entry_one": "one entry",
  "entry_other": "{{count}} entries"
}

// locales/de.json
{
  "entry_zero": "kein Eintrag",
  "entry_one": "ein Eintrag",
  "entry_other": "{{count}} Einträge"
}
```

There are languages that have more forms, [The Unicode Common Locale Data Repository (CLDR) ](https://cldr.unicode.org/index/cldr-spec/plural-rules) defines six forms:

1. zero
2. one (singular)
3. two (dual)
4. few (paucal)
5. many
6. other (required—general plural form)

These six forms can be defined directly in the JSON file and the i18next will automatically select the correct form:

```json
// locales/en.json
{
  "entry_zero": "zero entries",
  "entry_one": "one entry",
  "entry_two": "two entries",
  "entry_few": "few entries",
  "entry_many": "many entries",
  "entry_other": "other entries"
}
```

Once the forms are defined, the correct representation will be displayed based on the selected language and count:

```ts
i18next.t("entry", { count: 0 }); // -> "zero entries"
i18next.t("entry", { count: 1 }); // -> "one entry"
i18next.t("entry", { count: 20 }); // -> "many entries"
```

When building a React component, the dynamic value can be passed to the translation function:

```tsx
import { useTranslation } from "react-i18next";

const ExampleComponent = ({ count }: { count: number }) => {
  const { t } = useTranslation();

  return (
    <div>
      <p>{t("entry", { count })}</p>
    </div>
  );
};
```

## Using namespaces

Depending on the size of the application sometimes it can be useful to breakup the translations into different groups.
Breaking up the translation files into different groups enables to **manages these translations based on feature, topic, domain or another grouping factor**.
In i18next this can be achieved by defining [**Namespaces**](https://www.i18next.com/principles/namespaces)

## Using defaults and fallbacks

There are situations where the key or translation might be missing at runtime.
i18next offers a number of ways to handle these situations. The most straight forward option is to pass a default value to the `t` function:

```tsx
<p>{t("key.one", "The default value we show")}</p>
// -> "The default value we show"
```

Not only will i18next display the value if the key is not found in the translation files,
it's also useful when running the key extraction script, as the default value will be used to populate the translation for the corresponding key.

If there is no default value defined, then i18next will return the key itself as the value:

```tsx
<p>{t("key.one")}</p>
// -> "key.one"
```

Another option is to call the `t` function with an array of keys, specifying a fallback incase the actual key can't be loaded:

```json
{
  ...,
  key: {
    notFound: "Falling back to a default"
  }
}
```

```tsx
<p>{t(["key.one", "key.notFound"])}</p>
// -> "Falling back to a default"
```

Aside from handling defaults on the key level, i18next also supports a fallback on the language level.

```ts
i18next.init({
  fallbackLng: "en",
});
```

You can specify the fallback language when initializing the `i18next` instance, additionally a list of fallbacks can be defined and will fallback based on the list ordering.
Finally one can also specify a fallback that depends on the user's current language.
Find more information on how to setup language fallbacks [here](https://www.i18next.com/principles/fallback#language-fallback).

There is also an option to define namespace fallbacks if you have namespaces defined.
For example you might have a `base` and a `main` namespace in your application.
When configuration the `i18next` instance you can define what the default and what the fallback namespace is:

```ts
18next.init({
  defaultNS: 'main',
  fallbackNS: 'base'
});
```

In the above example, we define the `main` as the default namespace and the `base` as the fallback.
Should a key not be found in the `main` namespace, i18next will seach for that key in the `base` namespace.
You can find more informaton on namespace fallback handling [here](https://www.i18next.com/principles/fallback#namespace-fallback).

## Using useTranslation

i18next offers a hook called `useTranslation`, that comes handy when needing to access the `t` (translation) function inside a React component. By default [a `Suspense` is triggered](https://react.i18next.com/latest/usetranslation-hook#what-it-does).

Here is an example of `useTranslation` inside a component:

```tsx
import React from "react";
import { useTranslation } from "react-i18next";

export const SomeComponent = () => {
  const { t, i18n } = useTranslation();

  return <div>{t("some.key", "Some default we want to define")}</div>;
};
```

Aside from providing the `t` function, `i18n` and `ready` (if suspense is set to false) are provided via the hook.
The `useTranslation` can also be called with either a single or multiple namespaces if needed:

```tsx
//  a single namespace
const { t, i18n } = useTranslation("namespace1");
// multiple namespace
const { t, i18n } = useTranslation(["namespace1", "namespace2"]);
```

As mentioned above, `useTranslation` triggers a `Suspense`, to disable the default behavior - an option object can be defined when calling the hook:

```tsx
const { t, i18n, ready } = useTranslation("namespace1", { useSuspense: false });
```

Turning off the default behavior requires to check for the `ready` state and handle the loading state in the code. Once the translations have been loaded, the `ready` state switches to `true` and we can render the actual internationalized part of the code.

Additionally i18next offers a [`withTranslation` higher order component](https://react.i18next.com/latest/withtranslation-hoc) that can be used instead of the `useTranslation` hook. `withTranslation` offers the same capabilities as the hook alternative.

```tsx
import React from "react";
import { withTranslation } from "react-i18next";

export const SomeComponent = ({ t, i18n }) => {
  return <div>{t("some.key", "Some default we want to define")}</div>;
};

// with namespace
const TranslatedComponent = withTranslation("namespace1")(SomeComponent);
// without namespace
const TranslatedComponent = withTranslation()(SomeComponent);

// calling the translated component without suspense
<TranslatedComponent useSuspense={false} />;
```

More information on `useTranslation` can be found [here](https://react.i18next.com/latest/usetranslation-hook).

## Using the Trans component

In most cases the `t` function is enough to translate most sentences, but there are situations where we might be dealing with complex structures, f.e. html tags within sentences. This is where the `<Trans>` function is useful.
Let's see an example:

```tsx
import React from "react";
import { useTranslation } from "react-i18next";

export const SomeComponent = ({ userName }: { userName: string }) => {
  const { t, i18n } = useTranslation();

  return (
    <div>
      Welcome <b>{userName}</b>, you can check for more information{" "}
      <a href="some-link">here</a>!
    </div>
  );
};
```

The above text can't be wrapped inside a single `t` function, as it has html tags we want to keep when translating. Here is how the `<Trans>` component can be used to keep the existing structure of the sentence:

```tsx
import React from "react";
import { useTranslation } from "react-i18next";

export const SomeComponent = ({ userName }: { userName: string }) => {
  const { t, i18n } = useTranslation();

  return (
    <div>
      <Trans i18nKey="moreInformationLink" ns="namespace1">
        Welcome <b>{{ userName }}</b>, you can check for more information
        {"  "}
        <a href="some-link">here</a>!
      </Trans>
    </div>
  );
};
```

The above wrapped sentence would be converted to the following string inside your translation file:

```json
{
  ...,
  "moreInformationLink": "Welcome <1>{{userName}}</1>, you can check for more information <4>here</4>!"
}
```

In general the `<Trans>` component is very useful when dealing with more complex html structures inside sentences and the need to keep those structures coherent across all languages. More information on working with the `<Trans>` component can be found [here](https://react.i18next.com/latest/trans-component).

## Using context

There are situations where one key can have different translations depending on the context. i18next provides [`context`](https://www.i18next.com/translation-function/context) to distinguish between different translations of the same key.

Let's take a look at an example: In our application we display different types of menu items, some are vegetarian and some are not. Our `en.json` translation file might contain the following entries:

```json
"food": "A food item",
"food_vegetarian": "A vegetarian item",
"food_non_vegetarian": "A non vegetarian item",
```

As we can see, there is a base translation for `food`, but depending on the vegetarian/non_vegetarian context we might want to render a different text.
Further more we can combine the context with pluralization:

```json
"food_vegetarian_one": "One vegetarian item",
"food_non_vegetarian_one": "One non vegeterian item",
"food_vegetarian_other": "{{count}} vegetarian items",
"food_non_vegetarian_other": "{{count}} non vegetarian items"
```

This enables us to use the `context` option when calling the `t` function like so:

```tsx
<p>{t("food")}</p>
// "A food item"

<p>{t("food", { context: "vegetarian" })}</p>
// "A vegetarian item"

<p>{t("food", { context: "non_vegetarian" })}</p>
// "A non vegetarian item"

<p>{t("food", { context: "vegetarian", count: 3 })}</p>
// "3 vegetarian food items"

<p>{t("food", { context: "non_vegetarian", count: 5 })}</p>
// "5 non vegetarian food items"
```

## Using TypeScript

The first thing we need to do according to the [documentation](https://www.i18next.com/overview/typescript) is to add a `i18next.d.ts` file, as we will need to augment the TypeScript definition:

```ts
import "i18next";

import ns1 from "locales/en/ns1.json";
import ns2 from "locales/en/ns2.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "ns1";
    resources: {
      ns1: typeof ns1;
      ns2: typeof ns2;
    };
    // ...
  }
}
```

Alternatively we can also create an `i18n.ts` file to initialize `i18next` and prepare the resources:

```ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ns1 from "./locales/en/ns1.json";
import ns2 from "./locales/en/ns2.json";

export const defaultNS = "ns1";

export const resources = {
  ns1,
  ns2,
} as const;

i18n.use(initReactI18next).init({
  debug: true,
  fallbackLng: "en",
  defaultNS,
  resources,
});
```

Now we can directly import `i18n.ts` in our `i18-next.d.ts` file:

```ts
import { defaultNS, resources } from "./i18n";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: typeof resources;
  }
}
```

The introduction of the `i18-next.d.ts` file ensures that we can only access keys that already exist in our language files now. This applies for the `t` function as well as the `<Trans>` component, both only accept keys that exist in the JSON translation files. Also the `useTranslation` hook will only accept the defined `namespaces`, otherwise the TypeScript compiler will complain.

You can find more information on setting up TypeScript with i18next [here](https://lingual.dev/blog/making-your-translation-keys-type-safe-in-react-typescript/)

## Using ICU with i18next

While i18next uses it's own i18n format, it **supports various message formats via plugins**. The well known **ICU message format**, which is used across a large number of platforms and programming languages, can be made to work with i18next via the [i18next-icu](https://github.com/i18next/i18next-icu) plugin.

This is especially useful for setups where the UI and backend code need to be streamlined and the backend code is already based on the ICU message format.

For a complete list of supported i18n formats [consult the documentation](https://www.i18next.com/overview/plugins-and-utils#i18n-formats).

## Working with dynamic keys

There are situations where we only **know which keys we want to translate at runtime**. Examples for these type of situations includes loading a list of items via an API endpoint and then rendering that list or dealing with error messages, where we don't know which error will throw.

i18next offers the capability to define dynamic keys when calling the `t` function. Take a look at the following list:

```ts
const items = ["print", "audio", "pdf", "ebook"];
```

This list of items is then rendered:

```tsx
<p className="example">
  {items.map((item) => (
    <div key={item}>{t(item)}</div>
  ))}
</p>
```

From the above example we can see that the `item` string is passed to the function, and i18next will try to load that dynamic key from the locale file.
Alternatively we can pass an array:

```tsx
<p className="example">
  {items.map((item) => (
    <div key={item}>{t([item])}</div>
  ))}
</p>
```

There are scenarios where our keys are nested and our locales file might look like this:

```js
{
  "format": {
    "print": "Book format",
    "audio": "Audio format",
    "pdf": "Pdf format",
    "ebook": "E-book format"
  }
}
```

Again, i18next knows how to load a nested key:

```tsx
<p className="example">
  {items.map((item) => (
    <div key={item}>{t(`format.${item}`)}</div>
  ))}
</p>

// alternatively pass an array
<p className="example">
  {items.map((item) => (
    <div key={item}>{t([`format.${item}`])}</div>
  ))}
</p>
```

From the above examples we can see that i18next can handle dynamic keys without any extra configuration. If the key exists in the active locales file, the corresponding translation will be correctly loaded.

For more information in regards to dynamic keys and extraction handling, you can read more [here](https://lingual.dev/blog/how-to-translate-dynamic-keys-in-i18next/).

## Extracting keys

[`i18next-parser`](https://github.com/i18next/i18next-parser) enables to define how keys should be extracted and where the translations should be saved.
It can be installed via:

```bash
yarn add -D i18next-parser
npm install --save-dev i18next-parser
pnpm add -D i18next-parser
```

i18next-parser offers a number of [options](https://github.com/i18next/i18next-parser?tab=readme-ov-file#options) that can be used when configuring i18next extraction handling.

Depending on your setup, the parser can be initialized and configured differently, but the most basic approach is to use the CLI:

```bash
i18next 'src/**/*.{ts,tsx}'
```

or defined as a command:

```json
{
  ...
  "i18n:extract": "i18next 'src/**/*.{ts,tsx}'
}
```

For more information and details on how to setup the extraction script for your setup, [consult the documentation](https://github.com/i18next/i18next-parser)

## Validating translations

The **state of our translations is in a constant change**, some keys are added, some are removed and others are updated. To better understand the state of our translations it can be a good idea to have some automation in place, that can inform as about the state of our internationalization efforts.

We are interested in understanding if we have missing translations in our target locale files or we if we have outdated keys and translations, that should actually be removed. Sometimes our translations are even broken, meaning they are incorrectly displayed in some languages. It's useful to know what we need to add, remove or fix.

[`i18n-check`](https://github.com/lingualdev/i18n-check) validates any i18next translation files and **checks for missing and broken translations**. This is achieved by comparing the source language with all target translation files. That way it's possible for i18n-check to find any inconsistencies between source and target files. These checks can be run as a pre-commit hook or on the CI depending on your use-case and setup.

You can find more information about i18n-check [here](https://lingual.dev/blog/introducing-i18n-check/) and how to setup i18n checks [here](https://github.com/lingualdev/i18n-check).

## Outro

We should now have a good understanding of what capabilities i18next offers and how we can use some of the more advanced feature to improve the internationalization work on our website or application.

If you have any questions or want to leave some feedback, you can find us on [Twitter](https://twitter.com/lingualdev).

## Links

[Pluralization](https://www.i18next.com/translation-function/plurals)

[Making your translation keys type-safe in React](https://lingual.dev/blog/making-your-translation-keys-type-safe-in-react-typescript/)

[How to translate dynamic keys in i18next](https://lingual.dev/blog/how-to-translate-dynamic-keys-in-i18next/)

[18next supported formats](https://www.i18next.com/overview/plugins-and-utils#i18n-formats)

[i18next-parser](https://github.com/i18next/i18next-parser)

[<Trans> component](https://react.i18next.com/latest/trans-component).

[Context](https://www.i18next.com/translation-function/context)

[i18n-check](https://github.com/lingualdev/i18n-check)
