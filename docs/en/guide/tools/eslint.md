# ESLint

For large Vue projects migrating their internationalization solution to `VoerkaI18n`, it's necessary to scan the project code for content that needs translation and wrap it with the `t` function. Doing this manually would be extremely time-consuming, so some tools are needed to complete this work more efficiently.

We provide the following solutions:

- The `voerkai18n wrap` command-line tool, which uses AI to scan project code and automatically wrap content with the `t` function. See [voerkai18n wrap](./cli) for details.
- An `eslint` plugin that helps us wrap content with the `t` function during code development - simply saving the code will complete the wrapping process.

