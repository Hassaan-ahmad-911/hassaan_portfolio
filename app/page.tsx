import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Journey } from "@/components/Journey";
import { Services } from "@/components/Services";
import { Skills } from "@/components/Skills";
import { Ticker } from "@/components/Ticker";
import { Work } from "@/components/Work";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Ticker />
      <About />
      <Skills />
      <Work />
      <Services />
      <Journey />
      <Contact />
      <Footer />
    </>
  );
}
