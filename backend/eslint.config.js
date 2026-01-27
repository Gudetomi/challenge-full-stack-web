import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import rocketseatConfig from "@rocketseat/eslint-config/node.js";
import importHelpers from "eslint-plugin-import-helpers";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default tseslint.config([
  {
    ignores: ["node_modules/**", "dist/**", "build/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...compat.config(rocketseatConfig),
  {
    languageOptions: {
      globals: {
        process: "readonly",
      },
    },
    plugins: {
      "import-helpers": importHelpers,
    },
    rules: {
      "import-helpers/order-imports": [
        "warn",
        {
          newlinesBetween: "always",
          groups: ["module", "/^@/", ["parent", "sibling", "index"]],
          alphabetize: { order: "asc", ignoreCase: true },
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "no-useless-constructor": "off",
      "@typescript-eslint/no-useless-constructor": "error",
    },
  },
]);
