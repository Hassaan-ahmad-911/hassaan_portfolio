import { Footer } from "@/components/Footer";
import { Journey } from "@/components/Journey";
import { NextPage } from "@/components/NextPage";
import { PageHeader } from "@/components/PageHeader";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("journey");

export default function JourneyPage() {
  return (
    <>
      <PageHeader page="journey" />
      <Journey standalone />
      <NextPage current="/journey" />
      <Footer />
    </>
  );
}
