import { Footer } from "@/components/Footer";
import { NextPage } from "@/components/NextPage";
import { PageHeader } from "@/components/PageHeader";
import { Work } from "@/components/Work";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("work");

export default function WorkPage() {
  return (
    <>
      <PageHeader page="work" />
      <Work standalone />
      <NextPage current="/work" />
      <Footer />
    </>
  );
}
