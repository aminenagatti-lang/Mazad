import {
  Navbar,
  Hero,
  LiveAuctions,
  HowItWorks,
  Trust,
  CTABanner,
  Footer,
} from "@/components/landing";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <LiveAuctions />
        <HowItWorks />
        <Trust />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
