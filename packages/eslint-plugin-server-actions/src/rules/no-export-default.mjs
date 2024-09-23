export default {
  meta: {
    type: "problem",
    docs: {
      description: "Enforce that server action files do not have default exports.",
    },
    schema: [],
  },
  create(context) {
    let isUseServer = false;

    return {
      ExpressionStatement(node) {
        if (node.directive === "use server") {
          isUseServer = true;
        }
      },
      ExportDefaultDeclaration(node) {
        if (isUseServer) {
          context.report({
            node,
            message: "Server action files must not have default exports",
          });
        }
      },
    };
  },
};
