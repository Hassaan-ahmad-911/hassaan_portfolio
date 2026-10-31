import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { NextPage } from "@/components/NextPage";
import { PageHeader } from "@/components/PageHeader";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("contact");

export default function ContactPage() {
  return (
    <>
      <PageHeader page="contact" />
      <Contact standalone />
      <NextPage current="/contact" />
      <Footer />
    </>
  );
}
