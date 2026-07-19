/** @type {import("stylelint").Config} */
export default {
  extends: ["stylelint-config-standard"],
  plugins: ["./scripts/stylelint-ban-utility-classes.mjs"],
  ignoreFiles: ["dist/**", "site/**", "node_modules/**"],
  rules: {
    // Framework CSS is authored densely in @layer; keep the gate focused on
    // correctness and the anti-utility policy rather than reflowing every file.
    "custom-property-pattern": null,
    "selector-class-pattern": [
      "^hk-",
      {
        message: "Only hk-* classes are allowed in Hikarion source (no utility classes)",
      },
    ],
    "selector-id-pattern": null,
    "no-descending-specificity": null,
    "import-notation": null,
    "color-function-alias-notation": null,
    "color-function-notation": null,
    "alpha-value-notation": null,
    "hue-degree-notation": null,
    "media-feature-range-notation": null,
    "declaration-block-no-redundant-longhand-properties": null,
    "rule-empty-line-before": null,
    "comment-empty-line-before": null,
    "custom-property-empty-line-before": null,
    "at-rule-empty-line-before": null,
    "declaration-block-single-line-max-declarations": null,
    "declaration-empty-line-before": null,
    "selector-not-notation": null,
    "value-keyword-case": null,
    // Needed for focus rings / mask / appearance on form controls.
    "property-no-vendor-prefix": null,
    "hikarion/ban-utility-classes": true,
  },
};
