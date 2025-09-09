import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ["next/typescript", "next/core-web-vitals", "prettier"],
    settings: {
      next: {
        rootDir: "../client",
      },
    },
  }),
];

export default eslintConfig;
