// Generates PWA icons from the DriftSpotter hexagon logo (the same mark
// used in the Navbar/Footer). Usage: node scripts/generate-pwa-icons.mjs
import sharp from "sharp";
import { mkdirSync } from "fs";

// scale: how much of the canvas the logo occupies. Maskable icons need the
// mark inside the ~80% safe zone so OS shapes (circles, squircles) don't
// clip it.
function logoSvg(size, scale) {
  const inner = Math.round(size * scale);
  const offset = Math.round((size - inner) / 2);
  return Buffer.from(`<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#0a0a0a"/>
  <svg x="${offset}" y="${offset}" width="${inner}" height="${inner}" viewBox="0 0 36 36">
    <path d="M18 2L32 10V26L18 34L4 26V10L18 2Z" stroke="#FF6B00" stroke-width="2" fill="none"/>
    <path d="M10 18C10 18 14 12 18 12C22 12 22 18 26 18C26 18 22 24 18 24C14 24 14 18 10 18Z" fill="#FF6B00" opacity="0.8"/>
    <circle cx="18" cy="18" r="2" fill="#0a0a0a"/>
  </svg>
</svg>`);
}

const OUT = "public/icons";
mkdirSync(OUT, { recursive: true });

const jobs = [
  { file: `${OUT}/icon-192.png`, size: 192, scale: 0.78 },
  { file: `${OUT}/icon-512.png`, size: 512, scale: 0.78 },
  { file: `${OUT}/icon-maskable-512.png`, size: 512, scale: 0.62 },
  { file: `${OUT}/apple-touch-icon.png`, size: 180, scale: 0.72 },
];

for (const { file, size, scale } of jobs) {
  await sharp(logoSvg(size, scale)).png().toFile(file);
  console.log(`${file} (${size}x${size})`);
}
