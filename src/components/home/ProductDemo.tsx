import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { Container, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { AppPreview } from "@/components/product/AppPreview";

export function ProductDemo({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const d = t.home.demo;
  return (
    <section aria-labelledby="demo-title" className="relative overflow-hidden bg-[#efe8d8] py-24 sm:py-32">
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(rgb(23_34_28/0.05)_1px,transparent_1px),linear-gradient(90deg,rgb(23_34_28/0.05)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <Container className="relative">
        <SectionHeading id="demo-title" eyebrow={d.eyebrow} title={d.title} lead={d.lead} align="center" />
        <Reveal className="mx-auto mt-14 w-full">
          <AppPreview />
        </Reveal>
      </Container>
    </section>
  );
}
