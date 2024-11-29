+++
title = "How to translate dynamic keys in i18next"
date = 2024-11-29
slug = "how-to-translate-dynamic-keys-in-i18next"
tags = ["i18n", "i18next", "react-i18next"]
summary = "Quick tips and tricks when working with dynamic keys in i18next. There are situations where we only know at runtime what the correct translation key is. This post will explain how to setup your code to work with dynamic translation keys and how to make the extraction code work nicely with those defined keys."
+++

## Introduction

There are situations where **we don't know what the exact translation key** is, as it requires specific runtime information. For example we might load an array of items from some API endpoint, and then iterate over every single item and print the item out. We know the keys for these items, but we do not know their ordering and/or if they will be rendered or not.

When we are dealing with so-called **dynamic keys**, as in this case, we can't simply write code like the following:

```ts
const { t } = useTranslation();
t("some.known.key", "This is the default translation.");
```

In this short tips and tricks post we will explain how to translate any dynamic keys and how to setup the extraction script in a way that the keys and their respective translations remain in the locales files when running the extraction script.

## Defining dynamic keys

To get a better understanding on how to setup our code to work nicely with dynamic keys, let's take a look at an example. Let's assume we have a list of formats we want to render and depending on the selected language be able to correctly translate these items at runtime. This list contains different formats:

```ts
const items = ["print", "audio", "pdf", "ebook"];
```

We have a corresponding translation file containing keys that we associate with the above list:

```json
{
  "print": "Book format",
  "audio": "Audio format",
  "pdf": "Pdf format",
  "ebook": "E-book format"
}
```

Our code might iterate over these items and print some text like so:

```tsx
<p className="example">
  {items.map((item) => (
    <div key={item}>{t("print.this.dynamic.key")}</div>
  ))}
</p>
```

From the above example you can see that we do not know what the specific key is, but we need to tell the `t` function to load the key dynamically.
`i18next` can take care of loading the correct translation dynamically by passing a string or an array instead. So the previous example can be refactored to:

```tsx
<p className="example">
  {items.map((item) => (
    <div key={item}>{t(item)}</div>
  ))}
</p>
```

or:

```tsx
<p className="example">
  {items.map((item) => (
    <div key={item}>{t([item])}</div>
  ))}
</p>
```

You will notice the we are now passing `item` or `[item]` to the `t` function.
In the [i18next fallback keys documentation](https://www.i18next.com/translation-function/essentials#multiple-fallback-keys) it says:

> _Calling the t function with an array of keys enables you to translate dynamic keys providing a non specific fallback value._

This feature is useful in all situations where we only know at runtime what the actual key is. Aside from fetched data, errors can be another topic where this scenario applies.

While the above example works out of the box, we might have a more complex structure when it comes to the translations, i.e. we might have **nested keys**. Let's extend our previous translation file and assume we have a nested structure:

```json
{
  "format": {
    "print": "Book format",
    "audio": "Audio format",
    "pdf": "Pdf format",
    "ebook": "E-book format"
  }
}
```

The above code would not load the correct key anymore as the specified key would not be found in the translation file. So how can we load nested keys in this specific keys?

```tsx
<p className="example">
  {items.map((item) => (
    <div key={item}>{t(`format.${item}`)}</div>
  ))}
</p>
```

```tsx
<p className="example">
  {items.map((item) => (
    <div key={item}>{t([`format.${item}`])}</div>
  ))}
</p>
```

We can construct the key dynamically and pass it to the `t` function like in the examples above. `i18next` will load the correct translation for every constructed key if it exists in the translation files.

{{< tip >}}
In situations where we do not know upfront what the specific key is: call the t function with either the dynamic key or an array containing the dynamic key(s) to ensure that the translation is correcly applied.
{{< /tip >}}

## Setting up the extraction code

`i18next` offers scripts to extract all the code from an existing codebase and generate the corresponding JSON files. If you are using the standard [`i18next-parser`](https://github.com/i18next/i18next-parser) to extract the keys, then you will need to adapt the extract command to account for dynamic keys.

Normally the extract script would go through the defined part of the codebase and add new found keys as well as remove non existent keys from the locales file. In the case of dynamic keys, this would mean that any references to these keys would get removed from the locales file, as they don't exist in the codebase. We might have keys like `format.pdf` or `format.ebook` defined in our default `en` locales file, but inside the code we refer to these as ``t(`format.${item}`)``. The parser will remove the two keys, as they do not exist inside the code.

To make the `i18next-parser` handle dynamic keys correctly, we need to update the configuration. Depending on how the configuration is setup, you will need to update the `keepRemoved` option, which allows to pass a list of keys to ignore and keep in the locales files. In our case, we added a `i18next.config.js` file and add the following options object:

```js
export default {
  keepRemoved: [/format.*/],
};
```

By defining a regex to skip any keys that start with `format` we ensure that these keys remain untouched in the locales files.

{{< tip >}}
Use the `keepRemoved` option when configuring the `i18next-parser` and provide a list of keys or regexes that should be skipped.
{{< /tip >}}

## Outro

We should have a good of understanding of how to work with dynamic keys in our `i18next` codebase and how to setup the `i18next-parser` to not remove any dynamic key references inside the locales files.

If you have any questions or want to leave some feedback, you can find us on [Twitter](https://twitter.com/lingualdev).

## Links

[i18next fallback keys documentation](https://www.i18next.com/translation-function/essentials#multiple-fallback-keys)

[i18next-parser](https://github.com/i18next/i18next-parser)
