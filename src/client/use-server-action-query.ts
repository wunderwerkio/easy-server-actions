import {
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  UndefinedInitialDataOptions,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";

import { ServerActionResult } from "../results";

type ExtractOk<T> = T extends {
  readonly ok: true;
  readonly val: infer V;
}
  ? V
  : never;

/**
 * Hook to query data via `useQuery` from a server action.
 *
 * This just wraps a `useQuery` hook and supplies a custom `queryFn` that
 * invokes the server action to fetch the data. Otherwise this hook works
 * exactly the same as `useQuery`.
 *
 * @param action - The server action to call.
 * @param options - Options for `useQuery`.
 */
export function useServerActionQuery<
  TInput,
  TResult extends ServerActionResult,
>(
  action: (input: TInput) => TResult | Promise<TResult>,
  options: Omit<UndefinedInitialDataOptions<ExtractOk<TResult>>, "queryFn"> &
    (keyof Parameters<typeof action>[0] extends undefined
      ? Record<string, never>
      : { input: Parameters<typeof action>[0] }),
): UseQueryResult<ExtractOk<TResult>>;
export function useServerActionQuery<
  TInput,
  TResult extends ServerActionResult,
>(
  action: (input: TInput) => TResult | Promise<TResult>,
  options: Omit<DefinedInitialDataOptions<ExtractOk<TResult>>, "queryFn"> &
    (keyof Parameters<typeof action>[0] extends undefined
      ? Record<string, never>
      : { input: Parameters<typeof action>[0] }),
): DefinedUseQueryResult<ExtractOk<TResult>>;
// eslint-disable-next-line
export function useServerActionQuery<
  TInput,
  TResult extends ServerActionResult,
>(
  action: (input: TInput) => TResult | Promise<TResult>,
  options:
    | (Omit<DefinedInitialDataOptions<ExtractOk<TResult>>, "queryFn"> &
        (keyof Parameters<typeof action>[0] extends undefined
          ? Record<string, never>
          : { input: Parameters<typeof action>[0] }))
    | (Omit<UndefinedInitialDataOptions<ExtractOk<TResult>>, "queryFn"> &
        (keyof Parameters<typeof action>[0] extends undefined
          ? Record<string, never>
          : { input: Parameters<typeof action>[0] })),
):
  | DefinedUseQueryResult<ExtractOk<TResult>>
  | UseQueryResult<ExtractOk<TResult>> {
  return useQuery({
    queryFn: async () => {
      const input = "input" in options ? options.input : undefined;

      const result = await action(input as TInput);
      if (result.err) {
        throw new Error();
      }

      return result.val as ExtractOk<TResult>;
    },
    ...options,
  });
}
