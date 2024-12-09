import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: { globals: globals.browser },
    ...pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    rules: {
      // Allow type 'any'
      "@typescript-eslint/no-explicit-any": "off",
      // General JavaScript/TypeScript rules
      "no-unused-vars": "warn", // Warns about unused variables
      "no-console": "off", // Allow console statements
      "prefer-const": "error", // Enforce const over let when possible

      // TypeScript specific rules
      "@typescript-eslint/no-explicit-any": "off", // Allow 'any' type
      "@typescript-eslint/explicit-module-boundary-types": "off", // No need for explicit return types on module boundaries
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }], // Warn on unused vars, but allow args prefixed with '_'
      "@typescript-eslint/no-inferrable-types": "off", // Allow explicit type definitions even if inferrable

      // Styling preferences
      "quotes": ["error", "single", { avoidEscape: true }], // Enforce single quotes
      "semi": ["error", "always"], // Enforce semicolons
      "indent": ["error", 2], // Enforce 2-space indentation

      // Best practices
      "eqeqeq": ["error", "smart"], // Enforce === and !==, except for null
      "curly": "error", // Require curly braces for all control statements
    },
  },
];
