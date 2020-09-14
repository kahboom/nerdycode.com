import { terser } from "rollup-plugin-terser";

export default {
  input: "src/src/main.js",
  output: [
    {
      file: "src/js/min.js",
      format: "iife",
      sourcemap: true,
      plugins: [terser()],
    },
  ],
};
