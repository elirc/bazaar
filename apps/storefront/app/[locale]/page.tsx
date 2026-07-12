import { notFound } from "next/navigation";
import { isStorefrontLocale, locales, storefrontMessages } from "../../src/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocalizedHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isStorefrontLocale(locale)) notFound();
  const message = storefrontMessages(locale);
  return <section lang={locale}><h1>Bazaar</h1><p>{message.welcome}</p><a href={`/${locale}/collections/market-favorites`}>{message.shop}</a></section>;
}
