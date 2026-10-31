import { Footer } from "@/components/Footer";
import { NextPage } from "@/components/NextPage";
import { PageHeader } from "@/components/PageHeader";
import { Skills } from "@/components/Skills";
import { Ticker } from "@/components/Ticker";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("skills");

export default function SkillsPage() {
  return (
    <>
      <PageHeader page="skills" />
      <Ticker />
      <Skills standalone />
      <NextPage current="/skills" />
      <Footer />
    </>
  );
}
