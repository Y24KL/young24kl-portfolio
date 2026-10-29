// Generates responsive WebP renditions of the studio photography.
//
//   npm run images
//
// Source JPGs in src/assets stay untouched (they are the masters). Output goes
// to public/portfolio/<name>-<width>.webp plus a tiny <name>-lqip.webp blur
// placeholder. The URLs are stable (not build-hashed) so CMS documents can
// point at them. src/data/photo-manifest.json records each photo's intrinsic
// size so the site can reserve space and avoid layout shift. Existing renditions are
// skipped, so re-running after adding a photo only processes the new one.
import { readdir, mkdir, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const srcDir = path.join(root, 'src/assets');
const outDir = path.join(root, 'public/portfolio');
const manifestPath = path.join(root, 'src/data/photo-manifest.json');

const WIDTHS = [640, 1280, 2048];
const QUALITY = 74;
// Brand artwork, not photography.
const SKIP = new Set(['24KL VISUALS_LE_upscale_prime.jpg']);

const exists = (p) => access(p).then(() => true, () => false);
const baseName = (file) => path.parse(file).name.replace(/\s+/g, '-');

await mkdir(outDir, { recursive: true });

const files = (await readdir(srcDir)).filter((f) => /\.jpe?g$/i.test(f) && !SKIP.has(f));
const manifest = {};

for (const file of files) {
  const name = baseName(file);
  const input = sharp(path.join(srcDir, file)).rotate();
  const { width, height } = await input.metadata();
  // Never upscale: small sources get their native width as the largest rendition.
  const sizes = WIDTHS.filter((w) => w < width);
  if (width <= WIDTHS.at(-1)) sizes.push(width);

  for (const w of sizes) {
    const out = path.join(outDir, `${name}-${w}.webp`);
    if (await exists(out)) continue;
    await input.clone().resize({ width: w }).webp({ quality: QUALITY, effort: 5 }).toFile(out);
  }

  const lqip = path.join(outDir, `${name}-lqip.webp`);
  if (!(await exists(lqip))) {
    await input.clone().resize({ width: 24 }).blur(1.2).webp({ quality: 40 }).toFile(lqip);
  }

  manifest[name] = { width, height, widths: sizes };
  console.log(`${file.padEnd(16)} ${width}x${height} -> ${sizes.join(', ')}`);
}

await writeFile(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');

// 1200x630 Open Graph card for link previews (WhatsApp, iMessage, X, etc.).
const og = path.join(root, 'public/og-image.jpg');
if (!(await exists(og))) {
  await sharp(path.join(srcDir, 'IMG_9204.JPG'))
    .rotate()
    .resize(1200, 630, { fit: 'cover', position: 'attention' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(og);
}
