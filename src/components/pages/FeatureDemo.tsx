import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import type { FeatureSlug } from "@/content/site";
import { ShelfArt } from "@/components/illustrations/Shelf";
import { DuesDemo, ExpenseDemo, PurchaseDemo, ReportsMini, SalesBillDemo, ShelfDemo } from "@/components/home/FeatureDemos";
import { MicIcon } from "@/components/home/HeroStage";
import { fmtNumber, interpolate } from "@/lib/format";
import { intentFigures } from "@/content/voice";

/** The interactive demonstration that belongs to each feature. */
export function FeatureDemo({ slug, locale }: { slug: FeatureSlug; locale: Locale }) {
  const t = getDict(locale);
  switch (slug) {
    case "sales":
      return <SalesBillDemo />;
    case "inventory":
      return <ShelfDemo art={<ShelfArt className="w-full" />} />;
    case "purchases":
      return <PurchaseDemo />;
    case "expenses":
      return <ExpenseDemo />;
    case "customers":
      return <DuesDemo />;
    case "reports":
      return <ReportsMini />;
    case "assistant":
      return (
        <div className="on-dark rounded-2xl bg-forest p-6 text-cream">
          <div className="space-y-3">
            <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-cream px-4 py-2.5 text-ink">{t.home.voice.suggestions[2]}</p>
            <p className="w-fit max-w-[90%] rounded-2xl rounded-bl-md bg-leaf-deep px-4 py-2.5">
              {interpolate(t.home.voice.answers.stock, { count: fmtNumber(intentFigures.stock.count, locale), qty: fmtNumber(intentFigures.stock.qty, locale) })}
            </p>
          </div>
          <Link href={`/${locale}#voice`} className="mt-6 inline-flex items-center gap-2.5 rounded-full bg-leaf-deep px-5 py-2.5 font-semibold text-white transition-colors hover:bg-leaf-ink">
            <MicIcon className="size-4" />
            {t.home.featuresSection.assistant.cta}
          </Link>
          <p className="mt-3 text-xs text-marigold-soft/80">{t.home.hero.phoneNote}</p>
        </div>
      );
  }
}
