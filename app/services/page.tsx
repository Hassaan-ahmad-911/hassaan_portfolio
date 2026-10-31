import { Footer } from "@/components/Footer";
import { NextPage } from "@/components/NextPage";
import { PageHeader } from "@/components/PageHeader";
import { Services } from "@/components/Services";
import { ArrowRight } from "@/components/ui/Icons";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("services");

export default function ServicesPage() {
  return (
    <>
      <PageHeader page="services">
        <MagneticButton href="/contact">
          Start a project
          <ArrowRight className="transition-[translate] duration-500 ease-out-expo group-hover:translate-x-1" />
        </MagneticButton>
      </PageHeader>
      <Services standalone />
      <NextPage current="/services" />
      <Footer />
    </>
  );
}
