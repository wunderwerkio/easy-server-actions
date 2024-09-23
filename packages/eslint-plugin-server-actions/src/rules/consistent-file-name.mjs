import { getFilename, getFilenameWithoutExt, getFilePath } from "../utils.mjs";

export default {
  meta: {
    type: "problem",
    docs: {
      description: "Enforce server actions have consistent file names.",
    },
    schema: [],
  },
  create(context) {
    let isUseServer = false;

    return {
      ExpressionStatement(node) {
        if (node.directive === "use server" && node.parent.type === "Program") {
          isUseServer = true;
        }
      },
      "Program:exit": (node) => {
        if (!isUseServer) return;

        const filenameWithPath = getFilePath(context);
        const filename = getFilename(filenameWithPath);
        const filenameWithoutExt = getFilenameWithoutExt(filename);

        const caseOption = context.options.length?.[0];
        switch (caseOption) {
          case undefined:
          case "kebabcase":
            checkFileName(filenameWithoutExt, "-action", context, node);
            break;
          case "pascalcase":
          case "camelcase":
            checkFileName(filenameWithoutExt, "Action", context, node);
            break;
          case "snakecase":
            checkFileName(filenameWithoutExt, "_action", context, node);
            break;
          default:
            throw new Error(`Case '${caseOption}' is not supported!`);
        }
      },
    };
  },
};

/**
 * Check filename if it has given suffix.
 *
 * @param {string} filename - The filename.
 * @param {string} suffix - The suffix to check for.
 * @param {import('eslint').Rule.RuleContext} context - The rule context.
 * @param {import('eslint').Rule.Node} node - The current node.
 */
function checkFileName(filename, suffix, context, node) {
  if (!filename.endsWith(suffix)) {
    context.report({
      node,
      message:
        "Server Action file filename must end with `{{ suffix }}`: Unexpected filename: {{ filename }}",
      data: {
        suffix,
        filename,
      },
    });
  }
}
