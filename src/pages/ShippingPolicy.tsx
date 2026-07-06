import PageHero from "../components/page/PageHero";
import PageSectionBlock from "../components/page/PageSectionBlock";
import { getRegionalPolicyContent, SHIPPING_CONTENT } from "../data/siteContent";
import { useMarket } from "../hooks/useMarket";

export default function ShippingPolicy() {
  const { region } = useMarket();
  const page = getRegionalPolicyContent(region, SHIPPING_CONTENT);

  return (
    <div className="pt-32 pb-24">
      <div className="container-bio">
        <PageHero {...page.hero} primaryCta={page.cta} />
        <div className="mt-12 space-y-5">
          {page.sections.map((section) => (
            <PageSectionBlock key={section.title} {...section} />
          ))}
        </div>
      </div>
    </div>
  );
}
