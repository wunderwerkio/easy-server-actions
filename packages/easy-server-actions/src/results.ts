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
export interface ServerActionError<TMeta = Record<string, unknown>> {
  id?: string;
  links?: {
    about?: string;
    type?: string;
  };
  status?: string;
  code?: string;
  title?: string;
  detail?: string;
  source?: {
    pointer?: string;
    parameter?: string;
    header?: string;
  };
  meta?: TMeta;
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
export const ServerActionErr = <T extends ServerActionError>(err: T | T[]) => {
  const val = Array.isArray(err) ? err : [err];

  return {
    ok: false,
    err: true,
    val,
  } as const;
};

export type ServerActionResultErr = ReturnType<typeof ServerActionErr>;
