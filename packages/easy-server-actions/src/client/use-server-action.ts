import { DependencyList, useCallback, useTransition } from "react";

import { ServerActionResult } from "../results";

type ExtractOk<T> = T extends {
  readonly ok: true;
  readonly val: infer V;
}
  ? V
  : never;

type ExtractErr<T> = T extends {
  readonly err: true;
  readonly val: infer V;
}
  ? V
  : never;

type Options<TResult extends ServerActionResult> = {
  onSuccess?: (value: ExtractOk<TResult>) => void | Promise<void>;
  onError?: (
    firstError: ExtractErr<TResult>[number],
    errors: ExtractErr<TResult>,
  ) => void | Promise<void>;
};

/**
 * Hook to use a server action in a component.
 *
 * Returns an array with `callback` and `isPending`.
 *
 * Invoking `callback` triggers the server action. Depending on
 * server action outcome, the `options.onSuccess` or `options.onError` functions
 * are called accordingly.
 *
 * @param action - The server action to call.
 * @param options - Options object to specify result callbacks.
 * @param deps - Additional dependency array for the callback hook.
 */
export function useServerAction<TInput, TResult extends ServerActionResult>(
  action: (input: TInput) => TResult | Promise<TResult>,
  options: Options<TResult> = {},
  deps: DependencyList = [],
) {
  const [isPending, startTransition] = useTransition();

  const callback = useCallback(
    (input: TInput) => {
      return new Promise<ExtractOk<TResult>>((resolve, reject) => {
        // @ts-expect-error Should work as async: https://react.dev/reference/rsc/use-server#calling-a-server-action-outside-of-form
        startTransition(async () => {
          // Do nothing if already pending.
          if (isPending) return;

          const result = await action(input);

          if (result.ok) {
            await options.onSuccess?.(result.val as ExtractOk<TResult>);
            resolve(result.val as ExtractOk<TResult>);
          } else {
            await options.onError?.(
              result.val[0],
              result.val as ExtractErr<TResult>,
            );
            // eslint-disable-next-line
            reject(result.val as ExtractErr<TResult>);
          }
        });
      });
    },
    // eslint-disable-next-line
    [startTransition, action, isPending, options, ...deps],
  );

  return [callback, isPending] as const;
}
