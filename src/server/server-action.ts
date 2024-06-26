import { z, ZodSchema } from "zod";

import { ServerActionErr, ServerActionResult } from "../results";

type ValidationError = {
  readonly ok: false;
  readonly err: true;
  readonly val: {
    code: "validation_failed";
  };
};

/**
 * Overload with schema.
 *
 * Takes in a zod schema and the implementation function of the
 * server action.
 *
 * The callback function MUST return a ServerActionResult type.
 *
 * If input data is not valid against the given schema, a
 * ServerActionErr is returned.
 *
 * @param schema - Zod schema of the function input.
 * @param callback - The server action implementation.
 */
export function serverAction<
  TSchema extends ZodSchema,
  TReturn extends PromiseLike<ServerActionResult>,
>(
  schema: TSchema,
  callback: (input: z.infer<TSchema>) => TReturn,
): (input: z.infer<TSchema>) => Promise<Awaited<TReturn> | ValidationError>;

/**
 * Overload without schema.
 *
 * Takes in just the implementation function of the server action.
 *
 * The callback function MUST return a ServerActionResult type.
 *
 * @param callback - The server action implementation.
 */
export function serverAction<TReturn extends PromiseLike<ServerActionResult>>(
  callback: () => TReturn,
): () => TReturn;

/**
 * Core implementation of the server action function.
 *
 * This function creates a react server action with
 * optional zod schema input validation support.
 *
 * @param schemaOrCallback - The Zod schema, if the server action supports input, otherwise the server action function.
 * @param callback - If a schema is used, the server action function.
 */
export function serverAction<TReturn extends PromiseLike<ServerActionResult>>(
  schemaOrCallback: ZodSchema | (() => PromiseLike<TReturn>),
  callback?: (data: unknown) => PromiseLike<TReturn>,
) {
  if (typeof schemaOrCallback === "function") {
    return () => schemaOrCallback();
  }

  return (input: unknown) => {
    const validationResult = schemaOrCallback.safeParse(input);
    if (!validationResult.success) {
      // eslint-disable-next-line
      console.error(
        "[Server Action] Validation failed:",
        validationResult.error.toString(),
      );

      return ServerActionErr({
        code: "validation_failed",
      });
    }

    return callback?.(validationResult.data);
  };
}
