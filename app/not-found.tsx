import { MagneticButton } from "@/components/ui/MagneticButton";
import { ArrowLeft } from "@/components/ui/Icons";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-7xl flex-col items-start justify-center gap-8 px-4 py-24 sm:px-8">
      <p className="eyebrow">Error 404 — layer not found</p>
      <h1 className="text-[clamp(3rem,9vw,8rem)] font-semibold leading-[0.92] tracking-[-0.05em]">
        Nothing <span className="serif-italic font-normal">here.</span>
      </h1>
      <p className="max-w-md text-lg text-muted">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <MagneticButton href="/">
        <ArrowLeft />
        Back home
      </MagneticButton>
    </section>
  );
}
