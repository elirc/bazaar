import { notFound } from "next/navigation";
import { isStorefrontLocale, locales, storefrontMessages } from "../../src/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isStorefrontLocale(locale)) return {};
  return {
    title: "Bazaar",
    alternates: {
      canonical: `https://bazaar.example/${locale}`,
      languages: { "en-US": "https://bazaar.example/en-US", "fr-FR": "https://bazaar.example/fr-FR", "x-default": "https://bazaar.example/en-US" },
    },
    openGraph: { title: "Bazaar", locale: locale.replace("-", "_"), type: "website" as const },
  };
}

export default async function LocalizedHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isStorefrontLocale(locale)) notFound();
  const message = storefrontMessages(locale);
  return <section lang={locale}><h1>Bazaar</h1><p>{message.welcome}</p><a href={`/${locale}/collections/market-favorites`}>{message.shop}</a></section>;
}
