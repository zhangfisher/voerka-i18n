# Workflow

`VoerkaI18n` is a complete engineered internationalization solution that provides a comprehensive workflow to simplify the internationalization development process.

The basic workflow is as follows:

## Step 1: Initialize Project

Use `voerkai18n init` to perform initialization, creating the corresponding language folder, by default in `src/languages`.

## Step 2: Configure Application

- Based on the project framework type, install the corresponding integration libraries, such as `@voerkai18n/react`, `@voerkai18n/vue`, `@voerkai18n/vue2`, etc.
- Configure the application, such as installing corresponding plugins.

## Step 3: Use Translation Functions and Components

```ts
t("VoerkaI18n是一个国际化解决方案")
<Translate message="VoerkaI18n是一个国际化解决方案" />
<Translate id="voerka">
Paragraph content
</Translate>
```

- You can import the translation function `t` and `Translate` component from `src/languages` in your source code.
- In some integration libraries, the `t` function or `Translate` component might be registered globally for use, see the corresponding integration library.

## Step 4: Extract Translation Content

Use the `voerkai18n extract` command to extract translation content, generating text and paragraphs that need translation to:

- **Regular Text:** Extracted to `languages/translates/messages/*.json`
- **Paragraphs:** Extracted to `languages/translates/paragraphs/*.html`

## Step 5: Translate Content

Use the `voerkai18n translate` command to translate content.

## Step 6: Compile Language Packs

Use the `voerkai18n compile` command to compile language packs, generating to:

- **Regular Text:** `languages/messages/`
- **Paragraphs:** `languages/paragraphs/`
