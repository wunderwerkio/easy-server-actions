import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/index.ts", "./src/client/index.ts", "./src/server/index.ts"],
  outDir: "./dist",
  splitting: false,
  sourcemap: true,
  clean: true,
  target: "es6",
  format: "esm",
  dts: true,
});
