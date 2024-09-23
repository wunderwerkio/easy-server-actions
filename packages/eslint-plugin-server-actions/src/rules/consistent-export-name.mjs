export default {
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforce that exported server actions have consistent export names.",
    },
    fixable: "code",
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
      ExportNamedDeclaration(node) {
        if (!isUseServer) return;

        if (node.declaration?.type === "VariableDeclaration") {
          for (const declaration of node.declaration.declarations) {
            if (declaration.init.type === "Literal") {
              continue;
            }

            if (
              declaration.id.type === "Identifier" &&
              !declaration.id.name.endsWith("Action")
            ) {
              context.report({
                node: declaration,
                message:
                  "Unexpected Server Action export name. Append `Action` to `{{ name }}`",
                data: {
                  name: declaration.id.name,
                },
                fix(fixer) {
                  return fixer.replaceText(
                    declaration.id,
                    declaration.id.name + "Action",
                  );
                },
              });
            }
          }
        }
      },
    };
  },
};
