import PageHero from "../components/page/PageHero";
import PageSectionBlock from "../components/page/PageSectionBlock";
import { LIVING_PAGE_HERO, LIVING_SECTIONS } from "../data/siteContent";

export default function Living() {
  return (
    <div className="pt-24 pb-20 md:pt-32 md:pb-24">
      <div className="container-bio">
        <PageHero {...LIVING_PAGE_HERO} />
        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {LIVING_SECTIONS.map((section) => (
            <PageSectionBlock key={section.title} {...section} />
          ))}
        </div>
      </div>
    </div>
  );
}
