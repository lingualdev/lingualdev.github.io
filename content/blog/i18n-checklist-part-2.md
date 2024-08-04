+++
title = "An almost complete checklist for your i18n efforts Part 2"
date = 2024-07-19
slug = "checklist-for-your-i18n-efforts-part-2"
tags = ["i18n"]
+++

## Introduction

This is the second part of the checklist to support your 18n efforts, you can also checkout [part 1 here]({{< ref "/blog/i18n-checklist-part-1.md" >}}) in case you haven't read it.

The first part focused on a wide range of topics including choosing the right library, providing context, design aspects, pluralization and more. The second part will continue covering more aspects like **right-to-left languages**, **testing and validating your localization**, **unicode**, **device sizes** and **conditional text and grammar**.

It's always a good idea to consider a wide range of angles when approaching internalionalization as it is always more than just simple string translations.

## Testing and validating your localization

To ensure that your application does not break when working with different languages, there are a couple of possible approaches you can choose from.

If you don't want to test specific regions or translations, there is an option to **test different text lengths** by randomizing the text. This can help to ensure that different word lengths do not break the layout.

For a more qualitative approach, you can have native speakers **manually test the application** and collect the feedback based on these tests. This a more intensive approach which also can't be automated, but can provide very valuable and deep insights when rolling out the application to a new region.

The third approach is to use **checkers and linters**. These can help to identify missing keys in specific translations files. Further more some checkers can also identify broken translations. You can run these linters/checkers locally while developing features and/or run them on the CI and get notfied when something is broken. In general these tools can be very helpful to understand the state of the translations when you are not using any translation management system.

Finally you can also run automated tests against specific languages in your app, these tests can range from UI tests that verify specific strings exist to more advanced approaches like visual regression testing.

You can also checkout [i18n-check](https://github.com/lingualdev/i18n-check) if you are using `react-intl` or `react-i18next` to verify your translations.

```txt
Tip: It's a good idea to research what tools are available for your programming
lanuage and/or framework first and then mix different approaches and see what
yields the best results.
```

## Right-to-left languages

There are cases where we might need to **support right-to-left languages**, which means that we not only need to consider that the direction of the text changes but also that user interface elements might have to be adapted and made suitable as well.

So right-to-left languages need to be thought about on the user interface level not only on the actual translation level. This also implies to think about the required adaptions needed in regards to the UI elements (i.e. buttons, sliders etc.) in the design phase. Additionally these design and layout adaptions should also be ensured through UI testing and other quality assurance tools.

```txt
Tip: Consider right-to-left languages, as these not only need to be translated but also might require visual adaptions to the user interface!
```

## Unicode

This tip is a short one, always use **Unicode (UTF-8)** encoding to ensure that your translations are displayed correctly independent of the selected locale.
We will be writing a more detailed blog post on Unicode soon.

```txt
Tip: Use Unicode (UTF-8) encoding!
```

## Device sizes

Depending on the range of devices we want to support, it can be a good strategy to verify how the word length and device size fit together. Do specific sentences break the user interface given a specific width or height? We need to ensure that the UI remains consistent.

```txt
Tip: Consider device sizes and how these might affect the translations.
Check if word length in a specific locale breaks the layout.
Try to adapt the user interface to the different device sizes you want to support.
```

## Conditional text and grammar

One common mistake is to assume that the structure of a sentence can be replicated over different locales. This would imply that we can break up a sentence into multiiple parts and concatenate them in the code.

This is problematic, as first we can not guarantee that the selected target language follows the implied order defined in the code and second, it's very hard for the translator to understand and control the sentence.

Let's see an example to get a better understanding.

```ts
"Welcome,"  name + "!"
```

The above example would break the string into three parts and assume the structure will work for all locales

A better way is to **use full sentences and work with placeholders**. The advantage is that the translator now has a full understanding of the sentence and can change the ordering of the words themselves. This approach brings back the flexibility needed to adapt to specific locale requirements.

So the above example would be refactored to a single sentence with a placholder `name`:

```ts
"Welcome, {name}!";
```

Now the translator can adapt the structure as needed when translating the source string into a target locale. Also, if there are placeholders in place, more information about the placeholder should be provided the translator. This helps to gain an understanding for what the placeholder stands and how to incorporate it into the target language.

```txt
Tip: Try to keep full sentences intact and only break them up if there is a good reason.
Additionally use placeholders for things that don't rely on pluralization, gender or number
and might change due to the aforementioned!

```

## More aspects to consider

There are a lot more topics to consider when planing into internationalize your app or website, for example:

- **Consider to separte text from images**: simplifies the translation process when updating the text. Otherwise if the image contains text, it will need to updated to the target locale(s).

- **Selecting a translation management system**: there might be a need to use a management system to handle the translations. Depending on the situation and complexity of your setup, these tools can range from only updating the translations to handling complex workflows with multiple roles (translators, admins etc.)

- **Using machine translations**: These can help to get some basic translations in place, that can be refined in a further step.

- **Accessibility**: The topic is bigger than i18n, but also good to consider and keep in mind when following an internationalization strategy.

These were some further examples to highlight the complexity of the i18n topic.

## Outro

This was the second and final part of our **two part checklist series**. In general we should have a better understanding and overview about what to consider when planning to introduce i18n into an application.

If you have any questions or want to leave some feedback, you can find us on [Twitter](https://twitter.com/lingualdev).