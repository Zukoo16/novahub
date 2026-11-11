import { Hero } from "@/components/hero";
import { Stats } from "@/components/stats";
import { Categories } from "@/components/categories";
import { FeaturedCourses } from "@/components/courses-section";
import { HackathonsSection } from "@/components/hackathons-section";
import { EventsSection } from "@/components/events-section";
import { Certificate } from "@/components/certificate";
import { Gamification } from "@/components/gamification";
import { CTA } from "@/components/cta";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Categories />
      <FeaturedCourses />
      <HackathonsSection />
      <EventsSection />
      <Certificate />
      <Gamification />
      <CTA />
    </>
  );
}
