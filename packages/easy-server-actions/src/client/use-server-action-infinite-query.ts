import {
  DefinedInitialDataInfiniteOptions,
  DefinedUseInfiniteQueryResult,
  InfiniteData,
  UndefinedInitialDataInfiniteOptions,
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";

import { ServerActionResult } from "../results";

type ExtractOk<T> = T extends {
  readonly ok: true;
  readonly val: infer V;
}
  ? V
  : never;

/**
 * Hook to query data via `useInfiniteQuery` from a server action.
 *
 * This just wraps a `useInfiniteQuery` hook and supplies a custom `queryFn` that
 * invokes the server action to fetch the data. Otherwise this hook works
 * exactly the same as `useInfiniteQuery`.
 *
 * The page params need to be passed to the server action somehow.
 * This is achieved by using the `prepareQueryFn` method on `options`. This method allows to
 * create the server action input object. The infinite query page params are passed as the
 * first argument.
 *
 * @param action - The server action to call.
 * @param options - Options for `useInfiniteQuery`, and additional `prepareQueryFn`.
 */
export function useServerActionInfiniteQuery<
  TInput,
  TResult extends ServerActionResult,
>(
  action: (input: TInput) => TResult | Promise<TResult>,
  options: Omit<
    UndefinedInitialDataInfiniteOptions<ExtractOk<TResult>>,
    "queryFn"
  > & {
    prepareQueryFn: (
      pageParam: unknown,
    ) => keyof Parameters<typeof action>[0] extends undefined
      ? void
      : Parameters<typeof action>[0];
  },
): UseInfiniteQueryResult<InfiniteData<ExtractOk<TResult>>>;
export function useServerActionInfiniteQuery<
  TInput,
  TResult extends ServerActionResult,
>(
  action: (input: TInput) => TResult | Promise<TResult>,
  options: Omit<
    DefinedInitialDataInfiniteOptions<ExtractOk<TResult>>,
    "queryFn"
  > & {
    prepareQueryFn: (
      pageParam: unknown,
    ) => keyof Parameters<typeof action>[0] extends undefined
      ? void
      : Parameters<typeof action>[0];
  },
): DefinedUseInfiniteQueryResult<InfiniteData<ExtractOk<TResult>>>;
// eslint-disable-next-line
export function useServerActionInfiniteQuery<
  TInput,
  TResult extends ServerActionResult,
>(
  action: (input: TInput) => TResult | Promise<TResult>,
  options:
    | (Omit<
        UndefinedInitialDataInfiniteOptions<ExtractOk<TResult>>,
        "queryFn"
      > & {
        prepareQueryFn: (
          pageParam: unknown,
        ) => keyof Parameters<typeof action>[0] extends undefined
          ? void
          : Parameters<typeof action>[0];
      })
    | (Omit<
        DefinedInitialDataInfiniteOptions<ExtractOk<TResult>>,
        "queryFn"
      > & {
        prepareQueryFn: (
          pageParam: unknown,
        ) => keyof Parameters<typeof action>[0] extends undefined
          ? void
          : Parameters<typeof action>[0];
      }),
):
  | DefinedUseInfiniteQueryResult<InfiniteData<ExtractOk<TResult>>>
  | UseInfiniteQueryResult<InfiniteData<ExtractOk<TResult>>> {
  return useInfiniteQuery({
    queryFn: async (queryOptions) => {
      const input = options.prepareQueryFn(queryOptions.pageParam);

      const result = await action(input as TInput);
      if (result.err) {
        throw new Error();
      }

      return result.val as ExtractOk<TResult>;
    },
    ...options,
  });
}
