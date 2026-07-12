export const locales = ["en-US", "fr-FR"] as const;
export type StorefrontLocale = typeof locales[number];

const messages = {
  "en-US": { welcome: "Independent goods from thoughtful merchants.", shop: "Shop the collection", cart: "Your cart", checkout: "Checkout" },
  "fr-FR": { welcome: "Des créations indépendantes de marchands passionnés.", shop: "Voir la collection", cart: "Votre panier", checkout: "Paiement" },
} satisfies Record<StorefrontLocale, Record<string, string>>;

export function isStorefrontLocale(value: string): value is StorefrontLocale {
  return (locales as readonly string[]).includes(value);
}

export function storefrontMessages(locale: StorefrontLocale) {
  return messages[locale];
}
