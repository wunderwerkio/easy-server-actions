# @wunderwerk/eslint-plugin-server-actions

Rules for ESLint to check React server actions usage / implementation.

**Adds the following rules:**

- `server-actions/consistent-export-name`  
  If a file has "use server" declared at the top, any export MUST end with `Action`.
- `server-actions/consistent-file-name`  
  If a file has "use server" declared at the top, the file MUST end with `action`.
  Supports kebab, pascal, camel and snakecase.
- `server-actions/force-server-action-factory`  
  Ensures that any export in file with top-level "use server" is using the `serverAction`
  factory function.
- `server-actions/no-export-default`  
  Ensures that a file with top-level "use server" does not have a default export.
- `server-actions/no-inline-use-server`  
  Ensures that only top-level "use server" directives are used.

## Usage

Just add the `easy-server-actions` config to your eslint flat file config.

```js
import serverActionsPlugin from "@wunderwerk/eslint-plugin-server-actions";

export default [
  serverActionsPlugin.configs["easy-server-actions"],
];
```
