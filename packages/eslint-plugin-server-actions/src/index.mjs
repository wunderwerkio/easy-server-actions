import consistentExportName from "./rules/consistent-export-name.mjs";
import consistentFileName from "./rules/consistent-file-name.mjs";
import forceServerActionFactory from "./rules/force-server-action-factory.mjs";
import noExportDefault from "./rules/no-export-default.mjs";
import noInlineUseServer from "./rules/no-inline-use-server.mjs";

export const plugin = {
  rules: {
    "no-export-default": noExportDefault,
    "no-inline-use-server": noInlineUseServer,
    "force-server-action-factory": forceServerActionFactory,
    "consistent-export-name": consistentExportName,
    "consistent-file-name": consistentFileName,
  },
};

export const configs = {
  "easy-server-actions": {
    files: ["**/*.js", "**/*.ts"],
    plugins: {
      "server-actions": plugin,
    },
    rules: {
      "server-actions/no-export-default": "error",
      "server-actions/no-inline-use-server": "error",
      "server-actions/force-server-action-factory": "error",
      "server-actions/consistent-export-name": "error",
      "server-actions/consistent-file-name": "error",
    },
  },
};

export default {
  configs,
  plugin,
};
