import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Skills } from "@/components/Skills";
import { Ticker } from "@/components/Ticker";
import { TrainRide } from "@/components/TrainRide";
import { Work } from "@/components/Work";

// The homepage is kept short: projects come first, details live on their own pages
// (/work, /skills, /services, /journey, /contact).
export default function HomePage() {
  return (
    <>
      <Hero />
      <TrainRide />
      <Work />
      <Ticker />
      <About />
      <Skills />
      <Services />
      <Contact />
      <Footer />
    </>
  );
}
