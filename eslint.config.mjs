import react from "@wunderwerk/eslint-config/react";
import typescript from "@wunderwerk/eslint-config/typescript";

export default [
  ...typescript,
  // ...react,
  {
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
  },
];
