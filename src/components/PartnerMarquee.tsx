"use client";

import Image from "next/image";

// `light: true` marks logos designed for dark backgrounds (mostly-white
// artwork) — they get the no-invert ghost treatment in globals.css.
// `dark: true` marks logos with near-black artwork — their hover keeps an
// invert + hue-rotate so text stays visible on the dark page.
const partners = [
  { src: "/partners/thechoicefiles.png", alt: "The Choice Files", width: 600, height: 376 },
  { src: "/partners/lnk.svg", alt: "LNK", width: 260, height: 120, light: true },
  { src: "/partners/sptools.png", alt: "SP Tools", width: 649, height: 293 },
  { src: "/partners/kenda.webp", alt: "Kenda Tires", width: 2161, height: 577, dark: true },
];

export default function PartnerMarquee() {
  return (
    <section className="py-12" aria-label="Our partners and sponsors">
      <p className="text-xs text-muted-dark uppercase tracking-wider text-center mb-8">Partners & Sponsors</p>
      <div className="partner-marquee">
        <div className="partner-marquee-track">
          {[0, 1].map((copy) => (
            <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center gap-20 pr-20 m-0 list-none">
              {[...partners, ...partners, ...partners].map((p, i) => (
                <li key={`${p.alt}-${i}`} className="shrink-0">
                  <Image
                    src={p.src}
                    alt={copy === 0 ? p.alt : ""}
                    width={p.width}
                    height={p.height}
                    className={`partner-logo${p.light ? " partner-logo--light" : ""}${p.dark ? " partner-logo--dark" : ""}`}
                    unoptimized={p.src.endsWith(".svg")}
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
