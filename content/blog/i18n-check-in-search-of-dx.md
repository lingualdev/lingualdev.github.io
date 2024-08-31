+++
title = "In search of the DX in i18n"
date = 2024-08-31
slug = "in-search-of-the-DX-in-i18n"
tags = ["i18n"]
summary = "Most development areas have seen an increased focus on the developer experience, resulting in better solutions and tooling. I18n is a development area that doesn't have the same developer experience. This post tries to uncover the complexities around i18n and developer experience."
+++

## Introduction

**`I18n`** is one of these areas that seem to be treated as an afterthought. In general you have other concerns when starting to build out an application. Things like _which programming language or framework should we use?_ or _how do we model our data?_ are more important questions in the initial phase. If the core area of your business is not `I18n` itself, then there will always be more important areas that will require focus.

More often than not `I18n` comes later into play, like when your application has gained some traction or it has proven a concept and it's time to expand to new territories and regions. `I18n` and `L10n` are intertwined and we will not go into detail about the specifics, but assume we are talking about both from here on out.

So while we already have good to very good tooling in the form of advanced IDEs, CD/CI integration with our version control system or programming languages and frameworks that come with LSPs and great IDE integration, we don't have the same experience when it comes to `I18n`. In this post we will try to explore some reasons and what we could do to improve the `I18n` developer experience.

## Differing standards and implementations

One thing that you will notice when talking about `I18n` is that we don't have a concrete concept when we talk about our translations. We have differing standards for how strings, pluralization, time, money or number formatting is handled. Even when we talk about [**GNU gettext**](https://www.gnu.org/software/gettext/), we might still be dealing with different language specific implementations, placeholders for example might differ between the different language flavors.

But there is more than just `gettext`, we have another industry wide standard in the form of **International Components for Unicode** or **ICU**. Aside from that we have library specific implementation like `i18Next` that have their own internals on how to define and handle internationalization.

Every language implements it's own mechanics to handle the different specifications, so tooling has to be built around that specific implementation in most cases. This is one of the reasons why any improvement from a developer experience perspective is tied to someone implementing an `i18Next` or an `react-intl` extractor for example.

We mostly don't have general tools that work across the board, most improvements are coupled to a specific library or a translation service that offers tools to improve the experience.

## The I18n process is dependent on organizational structures

Aside from specifications, another aspect is that how `I18n` is handled depends on the business and not solely on the developer. When it comes to managing our engineering process we have learnt some general industry wide basics in the past, including checking code into a source version control or using branching or that we might want to automatically deploy to a staging environment once a feature has been merged into the trunk.

We have tools and platforms in place that support these ideas without being specifically tied to a programming language.

When it comes to introducing translations into our system, there is no specific way to do it and **if you ask ten different people how they do it, you will probably get ten different answers**. Just think about the endless possible combinations of how a string can be translated inside an organization. It could be that the translations are defined inside a spreadsheet or a notion page or an excel file or inside a ticket. They could also be added via a user interface and synced back into the source code. We don't know and we can't assume.

## Centralized translations vs. distributed development

When working on a feature **we isolate the development work from other features**. That enables us to build out the feature without having to think of side-effects that might affect other branches.

Now, if we think about our translations, these might be managed in a centralized database, so any change affects all branches. If there is no concept of branches, we can assume that our translations as being global, **a change affects all branches**.

From a developer perspective this breaks they way we approach the development process.
We now need to track any changes, we might even have to jump back and forth between our IDE and the centralised translation management system to understand the current state of our application.
If we don't use a centralized translation management system, we might still run into issues like trying resolve conflicts in our _JSON_ or _YAML_ translation files.

We might also need better instrumentation and tooling to resolve JSON conflicts.

## Context switching

To follow-up from the previous section, **context-switching is the problem when we need to jump back and forth between different files** to add or edit translations.

It breaks our flow when we add some translation key to the code and then have to jump into a _JSON_ or _YAML_ file to add theifferent translations for every locale. We might have to jump into multiple files.

This is suboptimal and makes it a tedious, manual task that doesn't feel like programming.
But it's not just that, we might need to keep coming up with new keys that should follow some structure (i.e. domain or folder/file specific). This is the case if we don't use the default translation as the key itself (when not working with `gettext` for example).

Further more there can be a need to offer the capability to provide some context to translators or other people interacting with the translations outside of the actual code.
What we need are **tools that enable us to do the change inside the code** and the updating of the locales in the background, where as developer we never have to interact with the locale files.

All these seemingly small tasks require manual effort if they are not automated or handled in the background.
All these small tasks addup to a lot of manual work. **As developers we do want less context-switches. The less the better**.

## Introducing I18n in hindight

There might be a moment where an application needs to be introduced into new markets. This can effectively mean a different language, different currency or pluralization rules.

What should happen when there are no existing `I18n` capabilities available inside a large surface area application?
This means these capabilities need to be introduced after the affect. This **can require weeks or months of work to change the codebase** from hardcoded strings to dynamic locale dependent text, money/time formatting or pluralization.

This sound like a tedious task, and is in most cases probably a tedious one. Not only does the `I18n` capability have to be introduced across the application, it might also break tests and have other side-effects like breaking the layout due to text length etc.

So there is a lot that comes with introducing `I18n` in hindsight. We would want **tools that can help us to scaffold an I18n library and replace strings** or sentences with library functions that can handle translations. Surely there are limits to this, like how do we know this sentence needs pluralization or that we are dealing with currencies in that sentence?

This would require our tools to have domain understanding, on the other hand these tools don't have to do the automation end to end.
Wouldn't it be interesting to have a command-line tool that would handle the basic rollout of the translation library across the codebase and replace all sentences inside tags with some basic translation mechanism?

Automatic transformation from:

```ts
const Content = () => {
    return (
        <div>
            <p>This is some title</p>
            <p>This is some paragraph</p>
            <div>{t('Should not change')}</div>
        </div>
    )
}
```

to:

```ts
const Content = () => {
    return (
        <div>
            <p>{t("content.paragraph.title", "This is some title")}</p>
            <p>{t("content.paragraph.paragraph", "This is some paragraph")}</p>
            <div>{t("Should not change")}</div>
        </div>
    );
};
```

## Summary

It's interesting to think more about how we can improve the future developer experience when it comes to `I18n`. We can try to invest more time into experimenting with **tools that can help us extract, compare/diff and even update our codebase**.

We are currently working on [`i18n-check`](https://github.com/lingualdev/i18n-check) where we are trying to help with validating translation files, including checking for missing and/or invalid/broken translations.
You can read more about it [here](https://lingual.dev/blog/introducing-i18n-check/).
In general there is still a lot of work we an do around making **the DX in I18n** better, this is what we will be trying to focus in the coming months.
