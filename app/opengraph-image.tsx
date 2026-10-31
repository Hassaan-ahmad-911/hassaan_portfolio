import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@/data/portfolio";

export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social preview: name, role and photo on the site's monochrome ground. */
export default async function OpengraphImage() {
  const photo = await readFile(join(process.cwd(), "public", profile.photo.src));
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0a0a0b",
          color: "#ededef",
          padding: 64,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 22, color: "#a1a1aa" }}>
            <div style={{ width: 12, height: 12, borderRadius: 12, background: "#ffffff" }} />
            {profile.availabilityLabel}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 112, fontWeight: 700, letterSpacing: -5, lineHeight: 0.95 }}>{profile.name}</div>
            <div style={{ fontSize: 36, color: "#c9c9cf", marginTop: 24 }}>{`${profile.role} · Web · Mobile · AI`}</div>
          </div>
          <div style={{ display: "flex", gap: 14, fontSize: 22, color: "#85858f" }}>
            Django · Next.js · Flutter · RAG · Computer vision
          </div>
        </div>
        <div style={{ display: "flex", position: "relative", width: 340, height: 502 }}>
          <div
            style={{
              position: "absolute",
              left: 36,
              top: 40,
              width: 304,
              height: 462,
              border: "1px solid #2e2e33",
              borderRadius: 12,
              background: "#111113",
            }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoSrc}
            alt=""
            width={304}
            height={462}
            style={{
              objectFit: "cover",
              objectPosition: "50% 30%",
              borderRadius: 12,
              border: "1px solid #3a3a40",
              filter: "grayscale(100%)",
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}
