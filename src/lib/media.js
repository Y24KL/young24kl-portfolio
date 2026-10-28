// Resolves a studio photo (by its source file name, e.g. "IMG_9204") to the
// responsive WebP renditions produced by `npm run images`.
import manifest from '../assets/optimized/manifest.json';

const files = import.meta.glob('../assets/optimized/*.webp', { eager: true, import: 'default' });
const file = (name, suffix) => files[`../assets/optimized/${name}-${suffix}.webp`];

export function photo(name, alt = '') {
  const meta = manifest[name];
  if (!meta) throw new Error(`Unknown photo "${name}". Run \`npm run images\` after adding it to src/assets.`);
  const { widths, width, height } = meta;
  return {
    id: name,
    type: 'image',
    alt,
    width,
    height,
    src: file(name, widths[Math.min(1, widths.length - 1)]),
    full: file(name, widths.at(-1)),
    srcSet: widths.map((w) => `${file(name, w)} ${w}w`).join(', '),
    placeholder: file(name, 'lqip'),
  };
}
