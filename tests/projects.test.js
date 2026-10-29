import { describe, expect, it } from 'vitest';
import { featuredToCmsDoc, fromCmsDoc, mergeProjects, storagePathFor, validateProjectFields, validateUpload } from '../src/lib/projects';

const featured = [
  { id: 'f1', title: 'CSC HOD GAMES', category: 'Sports', media: [{ type: 'image', src: 'a.webp' }] },
  { id: 'f2', title: 'SHODEINDE HALL WEEK', category: 'Events', media: [{ type: 'image', src: 'b.webp' }] },
];

const cms = (id, title, images = [{ url: `https://x/${id}.jpg`, type: 'image' }], extra = {}) =>
  fromCmsDoc(id, { title, images, createdAt: '2026-01-01', ...extra });

describe('fromCmsDoc', () => {
  it('keeps media order, videos and layout sizes', () => {
    const p = fromCmsDoc('p1', {
      title: ' unilag  concert ',
      images: [
        { id: 'm1', url: 'https://x/1.jpg', type: 'image', layoutSize: 'wide' },
        { id: 'm2', url: 'https://x/2.mp4', type: 'video' },
        { id: 'm3' }, // broken entry without a URL is dropped
      ],
    });
    expect(p.title).toBe('UNILAG CONCERT');
    expect(p.media.map((m) => [m.id, m.type, m.layoutSize])).toEqual([
      ['m1', 'image', 'wide'],
      ['m2', 'video', 'standard'],
    ]);
  });

  it('tolerates missing fields', () => {
    expect(fromCmsDoc('x', {})).toMatchObject({ title: 'UNTITLED', media: [], description: '', category: '' });
  });
});

describe('mergeProjects', () => {
  it('lists featured projects first, then CMS projects in order', () => {
    const merged = mergeProjects(featured, [cms('c1', 'Unilag Concert'), cms('c2', 'Night Market')]);
    expect(merged.map((p) => p.id)).toEqual(['f1', 'f2', 'c1', 'c2']);
  });

  // Regression: a CMS collection with the same name as a featured project used
  // to appear twice on the site.
  it('replaces a featured project with its CMS counterpart instead of duplicating it', () => {
    const merged = mergeProjects(featured, [cms('c1', 'csc hod games')]);
    expect(merged.map((p) => p.id)).toEqual(['c1', 'f2']);
    expect(merged[0].category).toBe('Sports'); // inherits the featured category when unset
  });

  it('hides CMS collections without a photo to use as the cover', () => {
    const videoOnly = cms('c3', 'Film Only', [{ url: 'https://x/v.mp4', type: 'video' }]);
    const empty = cms('c4', 'Empty', []);
    expect(mergeProjects(featured, [videoOnly, empty]).map((p) => p.id)).toEqual(['f1', 'f2']);
  });
});

describe('built-in project import', () => {
  const builtIn = {
    id: 'featured-x', title: 'CSC HOD GAMES', category: 'Sports', description: '',
    media: [{ id: 'IMG_1', type: 'image', src: '/portfolio/IMG_1-1280.webp', full: '/portfolio/IMG_1-2048.webp', srcSet: 'a 640w', placeholder: '/portfolio/IMG_1-lqip.webp', width: 3456, height: 5184 }],
  };

  it('round-trips through Firestore without losing order or renditions', () => {
    const data = featuredToCmsDoc(builtIn, '2026-01-01T00:00:00.000Z');
    expect(Object.keys(data).sort()).toEqual(['category', 'createdAt', 'description', 'images', 'title', 'updatedAt']);
    const back = fromCmsDoc('c9', data);
    expect(back.media[0]).toMatchObject({ src: builtIn.media[0].src, full: builtIn.media[0].full, srcSet: 'a 640w', width: 3456, height: 5184 });
  });

  it('keeps the built-in card key so the gallery does not remount', () => {
    const cmsCopy = fromCmsDoc('c9', featuredToCmsDoc(builtIn, '2026-01-01'));
    expect(mergeProjects([builtIn], [cmsCopy])[0]).toMatchObject({ id: 'c9', key: 'featured-x' });
  });

  // Regression: deleting an imported project in the CMS must remove it from the
  // site, not bring the built-in version back.
  it('stops showing built-in projects once imported', () => {
    expect(mergeProjects(featured, [], { featuredImported: true })).toEqual([]);
    expect(mergeProjects(featured, [cms('c1', 'Night Market')], { featuredImported: true }).map((p) => p.id)).toEqual(['c1']);
  });
});

describe('validation', () => {
  const file = (type, size, name = 'f') => ({ type, size, name });

  it('accepts images and videos within the storage.rules limits', () => {
    expect(validateUpload(file('image/jpeg', 5e6))).toBeNull();
    expect(validateUpload(file('video/mp4', 100e6))).toBeNull();
  });

  it('rejects other types and oversized files', () => {
    expect(validateUpload(file('application/pdf', 10))).toMatch(/only image or video/);
    expect(validateUpload(file('image/png', 30 * 1024 * 1024))).toMatch(/under 25 MB/);
  });

  it('requires a title and bounds the optional fields', () => {
    expect(validateProjectFields({ title: '  ' }).title).toBeTruthy();
    expect(validateProjectFields({ title: 'OK', description: 'x'.repeat(2001) }).description).toBeTruthy();
    expect(validateProjectFields({ title: 'OK', category: 'Sports' })).toEqual({});
  });

  it('builds safe storage paths', () => {
    expect(storagePathFor('p1', 'media-1', 'my photo (1).JPG')).toBe('portfolio/p1/media-1-my_photo_1_.JPG');
  });
});
