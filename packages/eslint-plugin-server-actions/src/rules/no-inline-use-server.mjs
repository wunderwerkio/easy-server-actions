export default {
  meta: {
    type: "problem",
    docs: {
      description: "Enforce that no inline 'use server' directives are used.",
    },
    schema: [],
  },
  create(context) {
    return {
      ExpressionStatement(node) {
        if (node.directive === "use server" && node.parent.type !== "Program") {
          context.report({
            node,
            message: "Inline 'use server' directives are not allowed",
          });
        }
      },
    };
  },
};
