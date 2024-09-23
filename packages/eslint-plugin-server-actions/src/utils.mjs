import { join, posix, sep } from "node:path";

/**
 * @example C:\
 */
const WINDOWS_DRIVE_LETTER_REGEXP = /^[A-Za-z]:\\/;

const FILENAME_WO_EXT_REGEXP = /^[a-zA-Z0-9_-]+/;

/**
 * Pipe an input through multiple processor functions.
 *
 * @param {Array<Function>} fns - The functions to apply to the input.
 * @returns {Function} A function that takes one input to process through each in ...fns.
 */
const pipe =
  (...fns) =>
  (x) =>
    fns.reduce((v, f) => f(v), x);

/**
 * Get the relative path from repo root.
 *
 * @param {string} fullPath - Filename with full path.
 * @param {string} repositoryRoot - Path of repository root.
 * @returns {string} Path from repository root.
 */
const getPathFromRepositoryRoot = (fullPath, repositoryRoot) =>
  fullPath.replace(join(repositoryRoot, sep), "");

/**
 * Change given path to POSIX variant.
 *
 * @param {string} p - File path based on the operating system.
 * @returns {string} File path in posix style.
 */
const toPosixPath = (p) => p.split(sep).join(posix.sep);

/**
 * Removes the drive letter from absolute path.
 *
 * @param {string} p - File path on windows.
 * @returns {string} - File path without drive letter on windows.
 */
const removeDriveLetter = (p) => p.replace(WINDOWS_DRIVE_LETTER_REGEXP, "");

/**
 * Get path to file of current eslint context.
 *
 * @param {import('eslint').Rule.RuleContext} context - Rule eslint context.
 * @returns {string} - File path in posix style.
 */
export const getFilePath = (context) => {
  const pathFromRoot = getPathFromRepositoryRoot(
    context.physicalFilename,
    context.cwd,
  );

  return pipe(removeDriveLetter, toPosixPath)(pathFromRoot);
};

/**
 * Get the filename from a path.
 *
 * @param {string} p - Filename concat with path in posix style.
 * @returns {string} - Filename without path.
 */
export const getFilename = (p) => posix.basename(p);

/**
 * Get the filename without extensions.
 *
 * @param {string} f - Filename with extension.
 * @returns {string} - Filename without extension.
 */
export const getFilenameWithoutExt = (f) =>
  FILENAME_WO_EXT_REGEXP.exec(f).at(0);
