import AccordionGroup from "../components/page/AccordionGroup";
import PageHero from "../components/page/PageHero";
import { FAQ_CATEGORIES, FAQ_PAGE_HERO } from "../data/siteContent";

export default function Faq() {
  return (
    <div className="pt-32 pb-24">
      <div className="container-bio">
        <PageHero {...FAQ_PAGE_HERO} />
        <div className="mt-12 space-y-8">
          {FAQ_CATEGORIES.map((category) => (
            <section key={category.title}>
              <h2 className="mb-4 text-2xl md:text-3xl">{category.title}</h2>
              <AccordionGroup
                items={category.items.map((item) => ({
                  title: item.question,
                  body: item.answer,
                }))}
              />
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
