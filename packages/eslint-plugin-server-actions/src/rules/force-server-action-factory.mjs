const ALLOWED_DECLARATION_TYPES = [
  "TSTypeAliasDeclaration",
  "TSInterfaceDeclaration",
];

export default {
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforce the use of the serverAction factory function to create server action endpoints.",
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
      ExportNamedDeclaration(node) {
        if (!isUseServer) return;
        const declarationType = node.declaration?.type;

        if (declarationType === "VariableDeclaration") {
          for (const declaration of node.declaration.declarations) {
            if (declaration.init.type === "Literal") {
              continue;
            }

            if (
              declaration.init.type !== "CallExpression" ||
              declaration.init.callee.type !== "Identifier" ||
              declaration.init.callee.name !== "serverAction"
            ) {
              context.report({
                node: declaration,
                message:
                  "Server Action exports must be created with the `serverAction` factory.",
              });
            }
          }
        } else if (!ALLOWED_DECLARATION_TYPES.includes(declarationType)) {
          context.report({
            node: node?.declaration ?? node,
            message:
              "Server Action exports must be created with the `serverAction` factory.",
          });
        }
      },
    };
  },
};
