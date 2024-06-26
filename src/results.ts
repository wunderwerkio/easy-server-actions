// This type defines the payload that is serializable by
// react server actions.
//
// @todo - Update this to support a Record<string, ServerActionPayload> somehow.
export type ServerActionPayload =
  | string
  | number
  | boolean
  | null
  | undefined
  | object
  | ServerActionPayload[]
  | { [key: string | number]: ServerActionPayload };

// The server action error.
export interface ServerActionError {
  code: string;
  title?: string;
  detail?: string;
}

// Defines a server action result.
export type ServerActionResult = ServerActionResultOk | ServerActionResultErr;

/**
 * Create a server action ok result.
 *
 * @param val - The success payload. Defaults to undefined if not set.
 */
export const ServerActionOk = <T extends ServerActionPayload>(val: T) => {
  return {
    ok: true,
    err: false,
    val,
  } as const;
};

export type ServerActionResultOk = ReturnType<typeof ServerActionOk>;

/**
 * Create a server action error result.
 *
 * @param err - The error.
 */
export const ServerActionErr = <T extends ServerActionError>(err: T) => {
  return {
    ok: false,
    err: true,
    val: err,
  } as const;
};

export type ServerActionResultErr = ReturnType<typeof ServerActionErr>;
