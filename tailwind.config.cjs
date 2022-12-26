const plugin = require("tailwindcss/plugin");

/** @type {import("tailwindcss").Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{jsx,tsx,html,md,mdx}",
    "./src/**/*.{jsx,tsx,html,md,mdx}",
    "./src/components/**/*.{jsx,tsx,html,md,mdx}",
    "../../packages/lego/src/*.{jsx,tsx,html,md,mdx}",
    "../../packages/lego/src/**/*.{jsx,tsx,html,md,mdx}",
    "../../packages/markdown/src/**/*.{jsx,tsx,html,md,mdx}"
  ],
  plugins: [
    plugin(function({ addVariant }) {
      addVariant("link", ["&:hover", "&:focus"]);
    })
  ]
};
