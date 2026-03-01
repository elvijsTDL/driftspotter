# DriftSpotter Design Guide — AI-First Asset Generation

> This guide defines DriftSpotter's visual identity and provides copy-paste prompts for generating brand-consistent assets with AI image tools (Midjourney, DALL-E, Ideogram, Recraft, Leonardo, Flux).

---

## 1. Brand DNA

| Attribute     | Value                                                                 |
|---------------|-----------------------------------------------------------------------|
| **Tagline**   | "Every Slide. Every Event. One Map."                                  |
| **Mood**      | High-energy street motorsport meets clean tech UI                     |
| **Aesthetic**  | Dark, carbon-fiber textures, glassmorphism, neon glow accents        |
| **Tone**      | Inclusive, action-oriented, community-first                           |
| **Audience**  | 18-35, drift enthusiasts, grassroots drivers, event spectators        |

---

## 2. Color Palette

Always reference these exact values when prompting for brand assets.

| Token               | Hex       | Usage                          |
|----------------------|-----------|--------------------------------|
| Drift Orange         | `#FF6B00` | Primary accent, CTAs, logo     |
| Drift Orange Dark    | `#CC5500` | Hover states                   |
| Drift Orange Light   | `#FF8C33` | Highlights, glows              |
| Drift Cyan           | `#00D4FF` | Secondary accent               |
| Drift Cyan Dark      | `#00A8CC` | Secondary hover                |
| Background           | `#0A0A0A` | Page background                |
| Surface              | `#111111` | Card backgrounds               |
| Surface Lighter      | `#222222` | Elevated surfaces              |
| Official (gold)      | `#FFD700` | Badge — pro/championship events|
| Grassroots (green)   | `#22C55E` | Badge — community events       |
| Pro-Am (blue)        | `#3B82F6` | Badge — semi-pro events        |
| Practice (gray)      | `#6B7280` | Badge — practice days          |

**Key constraint:** Background is always near-black. Orange is the hero accent. Cyan is the supporting accent. Never use both at equal weight — orange leads, cyan supports.

---

## 3. Typography

| Role     | Font           | Weight Range | Notes                              |
|----------|----------------|--------------|--------------------------------------|
| Headings | Chakra Petch   | 500–700      | Geometric, techy, motorsport feel    |
| Body     | Outfit         | 300–600      | Clean modern sans-serif              |
| Mono     | JetBrains Mono | 400–500      | Technical/code contexts only         |

When generating assets that include text, always specify **Chakra Petch** or a geometric/tech sans-serif as the font style in the prompt.

---

## 4. Logo & Wordmark

The current logo is a **hexagonal frame** containing a stylised tyre-mark/drift-line icon, coloured in `#FF6B00`. The wordmark reads **DRIFT**SPOTTER where "DRIFT" is white and "SPOTTER" is orange.

**Logo characteristics:**
- Hexagonal badge shape
- Contained drift line / tyre mark motif
- Flat/minimal style (not 3D, not photorealistic)
- Works on dark backgrounds

---

## 5. Visual Motifs to Reuse

These recurring elements define the DriftSpotter look. Reference them in prompts.

- **Carbon fibre texture** — subtle crosshatch pattern on dark backgrounds
- **Tire smoke / drift smoke** — wispy, horizontal, semi-transparent
- **Tyre marks / skid lines** — curved rubber trails
- **Glass panels** — frosted translucent UI cards
- **Neon glow** — orange and cyan edge-lighting, never overwhelming
- **Hexagonal shapes** — badges, frames, decorative elements
- **Diagonal speed lines** — motion indicators

---

## 6. AI Prompt Templates

### General prompting tips

1. **Always specify the background colour** (`#0A0A0A` or "near-black") to match the site.
2. **Always specify the accent colours** by hex (`#FF6B00` orange, `#00D4FF` cyan).
3. **Style keywords that match the brand:** minimal, flat, vector, motorsport, tech, geometric, dark theme, neon accent, carbon fibre.
4. **Negative keywords:** cartoon, childish, 3D render, photorealistic (unless generating event imagery), watercolour, pastel, bright background.
5. **Aspect ratios:** Logo/icon = 1:1. Social banners = 16:9 or 1200x630. Story = 9:16.

---

### 6.1 Logo Variations

**Primary logo refresh:**
```
Minimal flat vector logo for "DriftSpotter", a motorsport event discovery platform. Hexagonal badge shape containing a stylised drift tyre mark. Colour: #FF6B00 orange on #0A0A0A black background. Geometric, techy, clean. No gradients. Suitable for favicon and app icon. --style raw
```

**Alternate logomark — map pin + drift:**
```
Flat vector icon, map location pin combined with a drifting car tyre mark trail. Single colour #FF6B00 on transparent background. Minimal, geometric, works at 32x32px. Clean lines, no detail noise. --style raw
```

**Logomark — steering wheel + compass:**
```
Minimal flat icon combining a racing steering wheel with compass/map elements. Single accent colour #FF6B00, dark background #0A0A0A. Geometric, tech aesthetic, suitable as app icon. No text. --style raw
```

**Monochrome / white logo for merch:**
```
Minimal vector logo for a drift motorsport brand called "DriftSpotter". Hexagonal frame with tyre mark icon inside. All white on transparent background. Clean geometric lines, works for screen printing on dark apparel. --style raw
```

---

### 6.2 App Icon / Favicon

```
Square app icon for a drift event platform. Rounded corners (iOS style). Dark background #111111. Centred #FF6B00 orange hexagonal badge with minimal tyre mark icon. Subtle carbon fibre texture in background. Clean, modern, recognisable at 64x64px. --style raw
```

```
Favicon, 1:1, extremely simple. Orange (#FF6B00) map pin with a tiny drift smoke trail, on transparent background. Flat vector, 2-3 colours max. Must be legible at 16x16px. --style raw
```

---

### 6.3 Social Media Assets

**Open Graph / link preview image (1200x630):**
```
Social media banner for "DriftSpotter — Every Slide. Every Event. One Map." Dark background #0A0A0A with subtle carbon fibre texture. Large bold text in white geometric sans-serif font. Accent colour #FF6B00 on key words. Faint drift smoke wisps and tyre marks in background. Minimal, modern, tech aesthetic. 1200x630 pixels. --ar 16:9
```

**Twitter/X profile banner:**
```
Wide banner for a drift motorsport platform. Dark theme #0A0A0A background. Left side: bold "DRIFTSPOTTER" text in white with "SPOTTER" highlighted in #FF6B00. Right side: abstract drift tyre marks and faint smoke in #FF6B00 and #00D4FF cyan. Carbon fibre texture overlay. Minimal, modern. --ar 3:1
```

**Instagram story template:**
```
Instagram story template, 1080x1920, dark theme. Top: DriftSpotter logo in #FF6B00. Centre: large placeholder area for event photo. Bottom: glassmorphic frosted panel with event name, date, location fields in white text. Accent glow lines in orange. Carbon fibre background texture. Modern, clean. --ar 9:16
```

**Event announcement card:**
```
Social media card for a drift event announcement. Dark background #0A0A0A. Bold white text "EVENT NAME" in geometric sans-serif. Below: date and location in #888888 grey. Left border accent stripe in #FF6B00. Bottom: faint tyre smoke trail. Subtle carbon fibre texture. Minimal and clean. 1:1 square format.
```

---

### 6.4 Category Icons

**Official events (gold):**
```
Minimal flat vector icon, trophy or championship laurel wreath. Single colour #FFD700 gold on transparent background. Geometric, clean, 64x64. No gradients, no shadows. --style raw
```

**Grassroots events (green):**
```
Minimal flat vector icon, hand-drawn style spanner/wrench crossed with a steering wheel. Single colour #22C55E green on transparent. Approachable, community feel. 64x64. --style raw
```

**Pro-Am events (blue):**
```
Minimal flat vector icon, podium or rising arrow merged with a tyre silhouette. Single colour #3B82F6 blue on transparent. Clean, competitive feel. 64x64. --style raw
```

**Practice events (gray):**
```
Minimal flat vector icon, cone or traffic cone with circular motion lines around it. Single colour #6B7280 grey on transparent. Simple, welcoming. 64x64. --style raw
```

---

### 6.5 UI Illustrations & Empty States

**No events found:**
```
Minimal line illustration, dark theme. A lone road disappearing into fog/smoke, with faint orange (#FF6B00) tyre marks on the asphalt. Moody, atmospheric, #0A0A0A background. Suitable as empty state illustration for a web app. Clean, few elements.
```

**No comments yet:**
```
Minimal line illustration on #0A0A0A dark background. A speech bubble made of tyre smoke, faint #FF6B00 orange accent. Clean, atmospheric, few elements. Empty state for comments section.
```

**Sign in prompt:**
```
Minimal illustration, dark theme #0A0A0A. A racing helmet visor reflecting an orange #FF6B00 glow. Geometric, clean, tech aesthetic. Suitable as sign-in / onboarding illustration. --style raw
```

**Event submitted successfully:**
```
Minimal vector illustration, dark background. A checkered flag with an orange #FF6B00 glow behind it. Celebratory but clean, minimal confetti dots. Success state illustration.
```

---

### 6.6 Map Markers / Pins

```
Set of 4 map marker pins for a dark-themed map. Each is a teardrop/pin shape with a small icon inside: (1) trophy in #FFD700 gold, (2) wrench in #22C55E green, (3) podium in #3B82F6 blue, (4) cone in #6B7280 grey. Dark fill #111111 with coloured icon and top border. Flat vector, clean at 24x24px. White sheet, separated. --style raw
```

```
Custom map marker, teardrop pin shape. Dark body #111111, accent ring #FF6B00 orange. Small tyre icon inside. Designed for use on a dark map. Flat vector, crisp at 32px. Transparent background. --style raw
```

---

### 6.7 Hero / Background Images

**Landing page hero:**
```
Cinematic wide photo of a drift car mid-slide at night, rear angle, heavy tyre smoke illuminated by orange #FF6B00 and cyan #00D4FF lighting rigs. Dark asphalt, black sky. Dramatic, high contrast. Suitable as a dark website hero background with text overlay. --ar 21:9
```

**Map page background:**
```
Aerial night photograph of a race circuit with glowing orange track lights forming a curving pattern on black landscape. Abstract, moody, high contrast. Suitable as faint background texture under a map UI. --ar 16:9
```

**Forum header:**
```
Abstract dark background, top-down view of intersecting tyre marks on asphalt. Subtle orange #FF6B00 and cyan #00D4FF lighting from edges. Moody, textural, community/gathering vibe. Works as banner background with text overlay. --ar 3:1
```

---

### 6.8 Merch & Print

**T-shirt front graphic:**
```
Screen-printable graphic for black t-shirt. "DRIFTSPOTTER" in bold geometric uppercase, with tyre smoke trail extending from the R. Single colour: white or #FF6B00 orange. Minimal, streetwear aesthetic. Clean vector, no halftones. --style raw
```

**Sticker:**
```
Die-cut sticker design, hexagonal shape. "DS" monogram in bold geometric type, #FF6B00 orange on #0A0A0A black. Thin white border for die-cut edge. Small "DRIFTSPOTTER.COM" text below. Clean, minimal, looks good at 3 inches. --style raw
```

**Event poster template:**
```
Poster template for a drift event. Dark #0A0A0A background, bold white geometric text at top for event name. Centre: high-energy drift car silhouette with orange #FF6B00 smoke trail. Bottom: event details in clean white type. DriftSpotter logo small in corner. Vertical A3 format. Dramatic, modern. --ar 2:3
```

---

### 6.9 Email Assets

**Welcome email header:**
```
Email banner 600x200px. Dark background #0A0A0A. Left: DriftSpotter logo in #FF6B00. Right: faint drift smoke wisps. Centre text: "Welcome to the community" in white geometric font. Subtle carbon fibre texture. Clean, modern.
```

**Weekly digest header:**
```
Email banner 600x200px. Dark #0A0A0A background. Bold text "THIS WEEK IN DRIFT" in white with orange #FF6B00 underline accent. Faint tyre marks in background. Minimal, scannable. Works in email clients.
```

---

## 7. AI Tool Recommendations

| Tool | Best for | Notes |
|------|----------|-------|
| **Recraft V3** | Logos, icons, vectors | Best at flat vector styles; supports SVG export |
| **Ideogram 2.0** | Text in images, social cards | Best text rendering of any AI tool |
| **Midjourney v6** | Hero photography, atmospheric shots | Use `--style raw` for less AI look |
| **DALL-E 3** | Quick iterations, concept exploration | Good for ideation; less stylistic control |
| **Leonardo AI** | UI illustrations, consistent style sets | Good for generating sets of matching assets |
| **Flux 1.1 Pro** | Photorealistic event mockups | Good photorealism; fast |
| **Figma AI** | UI component generation | Use for generating UI variants from descriptions |

### Workflow

1. **Ideate** — Generate 4-8 options in Midjourney or DALL-E using the prompts above
2. **Refine** — Pick the best direction, iterate with more specific prompts
3. **Vectorise** — For logos/icons: use Recraft or run through a vectoriser (vectorizer.ai)
4. **Colour-match** — Adjust in Figma/Illustrator to exact hex values from palette
5. **Export** — SVG for icons/logos, WebP for photos, PNG for social cards

---

## 8. Asset Checklist

Track what's been generated and what's still needed.

| Asset | Status | File |
|-------|--------|------|
| Primary logo (SVG) | Existing | Inline SVG in Navbar |
| Favicon (ICO/PNG) | Needed | `public/favicon.ico` |
| Apple touch icon | Needed | `public/apple-touch-icon.png` |
| OG image — default | Needed | `public/og-default.png` (1200x630) |
| OG image — event template | Needed | Dynamic or template |
| Twitter banner | Needed | — |
| Instagram story template | Needed | — |
| Category icons (4) | Needed | `public/icons/category-*.svg` |
| Map markers (4) | Needed | `public/icons/marker-*.svg` |
| Empty state illustrations (3-4) | Needed | `src/components/` inline or `public/` |
| Hero background | Needed | `public/hero-bg.webp` |
| Email header — welcome | Needed | Resend template |
| Email header — digest | Needed | Resend template |
| Sticker design | Needed | Print-ready PDF |
| T-shirt graphic | Needed | Print-ready SVG |

---

## 9. Do's and Don'ts

**Do:**
- Keep backgrounds dark (#0A0A0A — #111111)
- Use orange as the dominant accent, cyan as secondary
- Maintain generous whitespace in UI assets
- Use geometric, angular shapes (hexagons, sharp angles)
- Include carbon fibre or subtle noise textures on large surfaces
- Test all icons at their smallest intended size before finalising

**Don't:**
- Use light/white backgrounds for in-app assets
- Mix more than 2 accent colours in a single asset
- Use rounded/bubbly/playful typefaces
- Use photorealistic renders for icons or logos
- Add drop shadows (use glows instead)
- Use stock photography — always generate or capture original imagery
