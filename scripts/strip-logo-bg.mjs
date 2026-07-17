// One-off: remove the white background from partner logos so they can sit
// directly on the dark site background (flood fill from the borders, so
// white *inside* the artwork — e.g. the SP Tools letters — is preserved).
// Usage: node scripts/strip-logo-bg.mjs
import sharp from "sharp";

const JOBS = [
  { in: "public/partners/thechoicefiles.webp", out: "public/partners/thechoicefiles.png" },
  { in: "public/partners/partner2.jpg", out: "public/partners/sptools.png" },
];

const NEAR_WHITE = 230; // BFS expands through pixels whose channels all exceed this
const FRINGE = 175; // relaxation passes eat the antialiased halo down to this

for (const job of JOBS) {
  const { data, info } = await sharp(job.in).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const idx = (x, y) => (y * w + x) * 4;
  const isWhite = (i, t) => data[i] > t && data[i + 1] > t && data[i + 2] > t;

  // flood fill near-white pixels connected to the image border
  const queue = [];
  const seen = new Uint8Array(w * h);
  for (let x = 0; x < w; x++) queue.push([x, 0], [x, h - 1]);
  for (let y = 0; y < h; y++) queue.push([0, y], [w - 1, y]);
  while (queue.length) {
    const [x, y] = queue.pop();
    if (x < 0 || y < 0 || x >= w || y >= h || seen[y * w + x]) continue;
    seen[y * w + x] = 1;
    const i = idx(x, y);
    if (!isWhite(i, NEAR_WHITE) || data[i + 3] === 0) continue;
    data[i + 3] = 0;
    queue.push([x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]);
  }

  // two relaxation passes: whitish pixels touching transparency go too
  for (let pass = 0; pass < 2; pass++) {
    const clear = [];
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = idx(x, y);
        if (data[i + 3] === 0 || !isWhite(i, FRINGE)) continue;
        const nbs = [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]];
        if (nbs.some(([nx, ny]) => nx >= 0 && ny >= 0 && nx < w && ny < h && data[idx(nx, ny) + 3] === 0)) clear.push(i);
      }
    }
    for (const i of clear) data[i + 3] = 0;
  }

  await sharp(data, { raw: { width: w, height: h, channels: 4 } }).png().toFile(job.out);
  console.log(`${job.in} -> ${job.out} (${w}x${h})`);
}
