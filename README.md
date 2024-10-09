# @wunderwerk/easy-server-actions

Provides convenient functions for both server and client to create and consume
React Server Actions!

**Table of Contents:**

- [Defining Server Actions](#defining-server-actions)
- [Consuming Server Actions](#consuming-server-actions)
  - [Fetch data](#fetch-data)
  - [Fetch paginated data](#fetch-paginated-data)
  - [Post data](#post-data)
- [ESLint Rules](#eslint-rules)

## Defining Server Actions

A Server Action can easily be created using the `serverAction` function.
By using `zod` an optional schema can be passed to validate incoming data.

```ts
"use server";

import {
  ServerActionErr,
  ServerActionOk,
} from "@wunderwerk/easy-server-actions";
import { serverAction } from "@wunderwerk/easy-server-actions/server";
import { z } from "zod";

// Payload schema.
const schema = z.object({
  name: z.string(),
});

/**
 * Server Action with input data.
 */
export const myAction = serverAction(schema, async (input) => {
  const greeting = `Welcome ${input.name}!`

  // Run your server code here!

  // On error.
  if (false) {
    return ServerActionErr({
      code: "some_error",
      title: "Some Error",
      detail: "An error occured whilst running the server action",
    });
  }

  return ServerActionOk(greeting);
});

/**
 * Server Action without input data.
 */
export const myActionWithoutSchema = serverAction(async () => {
  // Run your server code here!

  return ServerActionOk({
    data: "some-data",
  });
});
```

The return value of the server action must be either `ServerActionErr`
or `ServerActionOk`.

The `ServerActionOk` can contain any value, the signature of the error
must match the predefined type.

## Consuming Server Actions

This package provides integration with `@tanstack/react-query` to consume a
server action.

### Fetch data

Use a server action to just fetch data.

By using the `useServerActionQuery` react hook a server action can directly be
consumed and used like using `useQuery` from `@tanstack/react-query`.

This hook supports all the options as `useQuery`.

More Info: [TanStack Query `useQuery` Docs](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery).

```tsx
"use client";

import { useServerActionQuery } from "@wunderwerk/easy-server-actions/client";

import { myAction } from "../some-path";

export function MyComponent() {
    const { data, isLoading } = useServerActionQuery(myAction, {
        queryKey: ["some-key"],
    });

    return <div />;
}
```

### Fetch paginated data

Similar to the hook above there is a custom variant for paginated data.

The `useServerActionInfiniteQuery` react hook provides integration with
the `useInfiniteQuery` hook from `@tanstack/react-query`.

This hook supports all the options as `useInfiniteQuery`.

More Info: [TanStack Query `useInfiniteQuery` Docs](https://tanstack.com/query/latest/docs/framework/react/reference/useInfiniteQuery).

```tsx
"use client";

import { useServerActionInfiniteQuery } from "@wunderwerk/easy-server-actions/client";

import { myAction } from "../some-path";

export function MyComponent() {
    const { data, isLoading } = useServerActionInfiniteQuery(myAction, {
        queryKey: ["some-key"],
        prepareQueryFn(pageParam) {
            // `pageParam` is the param coming from the `getNextPageParam` function.
            // See `useInfiniteQuery` docs from TanStack Query for more info.

            // Return the input object for the server action here.
            return {};
        },
    });

    return <div />;
}
```

### Post data

Use a server action to post new data to the server.

The `useServerAction` react hook can be used to achieve that.

An array with a dispatch function and a loading boolean is returned from the hook,
success and error callbacks can be directly registered in the hook options.

```ts
"use client";

import { useServerAction } from "@wunderwerk/easy-server-actions/client";

import { myAction } from "../some-path";

export function MyComponent() {
    const [dispatchAction, isPending] = useServerAction(myAction, {
        onSuccess(greeting) {
            alert(greeting);
        },
        onError(err) {
            console.err(err);
            alert(err.title);
        },
    });

    const handleClick = async () {
        const greeting = await dispatchAction({
            name: "John Doe",
            email: "john@doe.com",
        });

        // You have access to the success value here.
        // Or you can skip the return value and just use
        // the `onSuccess` callback.
        // Similarily you can wrap the action call in a
        // try/catch to get the error, or just use the
        // `onError` callback.
    };

    return (
        <div>
            <button onClick={handleClick} disabled={isPending}>Dispatch</button>
        </div>
    );
}
```

## ESLint Rules

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

### Usage

Just add the `easy-server-actions` config to your eslint flat file config.

```js
import serverActionsPlugin from "@wunderwerk/eslint-plugin-server-actions";

export default [
  serverActionsPlugin.configs["easy-server-actions"],
];
```
