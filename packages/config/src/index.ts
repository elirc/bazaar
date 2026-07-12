export const audiencePolicies = {
  admin: {
    cache: "none",
    consistency: "fresh",
    stalenessToleranceSeconds: 0,
  },
  storefront: {
    cache: "layered",
    consistency: "bounded-stale",
    stalenessToleranceSeconds: 60,
  },
} as const;

export type Audience = keyof typeof audiencePolicies;
