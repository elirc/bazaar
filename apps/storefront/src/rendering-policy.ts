export const renderingPolicies = {
  home: { strategy: "ssg", stalenessToleranceSeconds: Number.POSITIVE_INFINITY },
  product: { strategy: "isr", stalenessToleranceSeconds: 60 },
  collection: { strategy: "isr", stalenessToleranceSeconds: 60 },
  cart: { strategy: "dynamic", stalenessToleranceSeconds: 0 },
} as const;
