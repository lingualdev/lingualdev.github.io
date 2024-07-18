---
title: An almost complete checklist for your i18n efforts Part 1
description: An extensive list of topics to consider when starting with i18n
date: 2024-07-06
permalink: blog/checklist-for-your-i18n-efforts-part-1.html
tags: ["i18n", "internationalization"]
---

## Introduction

More often than not, we start to think about internationalization once **the application is already in production**. The need for i18n could arise due to market expansion for example and thought and energy need to be invested in making the application multi language capable.
This can be a challenging task and the potential for overseeing some aspects is real.
We want to avoid scenarios that render our internationalization efforts ineffective. See the following as a **possible checklist** or a starting point to get an overview of what you might want to consider before starting any initiative.

This is **not meant to be a complete checklist** obviously, but rather a basic entry point in what you might want to give some thought on and extend with your specific situation (i.e. programming language, framework, domain specific boundaries etc.)

## Using an i18n library

Localization is more than just simply replacing a couple of strings, it requires us to think about aspects like date and time, numbers, pluralization, grammar and many more locale specific requirements. We want to customize all aspects of an application to the local market we are targeting, so **it's not just replacing strings**.
Almost every modern language and/or framework either offers built-in i18n support or there is a library that is optimized for said language/framework.

Research possible alternatives and ensure that the selected library supports pluralization and number/date/time formatting. For example in `react` the two most popular libraries, `react-i18next` and `react-intl`, support most i18n aspects by default.

```txt
Tip: Don't build your own i18n library, use existing, supported and tested solutions.
Let the library take care of currencies, date/time, numbers and pluralizations.
```

## Defining a localization strategy

Decide if you want to define message ids and default translations in code first and then extract these keys into locale files or if you want to always update the locale files first and then update the codebase depending on these locale files.

There is a current trend to also use **TypeScript** for the message id validation, where the compiler will complain if you use a non-existent message id and also leverage autocomplete/intelliSense when filling out the ids. The second approach would makes this flow possible.

On a side-note it might not be that important to use TypeScript for validating message id correctness as there are linters and checkers that can help ensuring the codebase and the locale files are in sync.

```txt
Tip: Decide if you want to apply i18n in code first or locale files first.
Define if the keys should be extracted from the codebase or if the locales files are updated first and then the keys applied to the codebase.
```

## Design

Although the design aspect of an application can feel detached from the translation process, they are actually more intertwined than we want to believe. Just think about the length of some word in English vs another language. Some languages use more characters for the same word.
Let's take the word `skating` in English, it translates to `Schlittschuhlaufen` in German. We can do the same with sentences that we translate from English to German or another language, which can significantly vary in length.

**The length of a sentence or string can vary**.

This means we should consider to leave some room for the strings to expand depending on the selected language. The space can be calculated dynamically and expand on demand or we can leave some fixed space, that can be filled out.
No matter what strategy we use, we should keep the varying string length in mind when designing the user interface. Taking this approach prevents strings from suddenly overlapping each other and other issues that can make your app feel broken, we want to avoid that.

```txt
Tip: Keep in mind that strings can vary in length.
Depending on the locale when designing the user interface!
```

## Pluralization

At first you might think that pluralization is defining a **singular** and **plural** form. This works for the English language. But if you take a closer look at the [The Unicode Common Locale Data Repository (CLDR) ](https://cldr.unicode.org/index/cldr-spec/plural-rules) plural rules, there are six defined forms:

- zero

- one (singular)

- two (dual)

- few (paucal)

- many

- other (required—general plural form)

This means we can't just do a simple check for singular and plural but need to accustom to the locale. Most i18n libraries account for this and can handle pluralization correctly.

```txt
Tip: Use an internationalization library to handle pluralization!
Avoid hardcoding any checks to show singular or plural forms.
```

## Currencies, units, time, date and number formatting

There is a lot more than simple string translations that we need to consider when localzing an application. Just think about aspects like **time and date formatting**. What we want is to ensure that our **i18n efforts reflect the selected end user locale**.
The most common approach is to avoid codifying any numbers, dates, time etc. and rather use a library to do that conversion for us by for example passing date and time in ISO format. Commonly you will find libraries for your language or framework that offer functionalities or components to do the heavyweight lifting.

```txt
Tip: Use an internationalization library to handle any units, time/dates, numbers or currencies formatting!
Avoid hardcoding units, time/dates, numbers or currencies.
```

## Ensure context

While as a developer you might have enough context in regards to a translated string, this might not be the case for an external translator or anyone without access to the code in general.
**The same string can have a different translation depending on the context**. We want keep this in mind and not lose the information once the translation is decoupled from the code base.
Adding context in the resource file can help a translator to understand where the translation is happening in the user interface. Context can be provided via using meta information or screenshots f.e.
Depending on the message format, there are defined ways to leave meta information associated with a message id.

```txt
Tip: Add context to your translation keys in the resource files!
This ensures that context specific information is not lost during the developer/translator handover.
```

## Outro

In part two we will expand the checklist and talk about topics like **right-to-left languages**, **device sizes**, **testing and validating your localization**, **unicode** and **conditional text and grammar**.

Update: **Part 2** has been published is available [here](/blog/checklist-for-your-i18n-efforts-part-2.html)

If you have any questions or want to leave some feedback, you can find us on [Twitter](https://twitter.com/lingualdev).
