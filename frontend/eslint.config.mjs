import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Include Next.js defaults + TS support
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Custom rules section
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
    rules: {
      // TypeScript rules
      "@typescript-eslint/no-explicit-any": "warn", // or "error"
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: false,
        },
      ],

      // Disable duplicate JS rules
      "no-unused-vars": "off",
      "no-undef": "off",

      // Optional: silence some Next.js and React warnings
      "@next/next/no-img-element": "off",
      "react/no-unescaped-entities": "off",
    },
  },
];
