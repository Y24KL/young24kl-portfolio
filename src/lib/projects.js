// Pure helpers shared by the public portfolio and the /admin CMS.
// Covered by tests/projects.test.js.

export const LIMITS = {
  title: 120,
  description: 2000,
  category: 60,
  imageBytes: 25 * 1024 * 1024, // keep in sync with storage.rules
  videoBytes: 500 * 1024 * 1024,
};

export const normalizeTitle = (title) =>
  String(title ?? '').trim().replace(/\s+/g, ' ').toUpperCase();

// Turns a Firestore `projects` document into the shape the gallery renders.
// Media order is preserved exactly as the admin arranged it.
export function fromCmsDoc(id, data = {}) {
  const media = (Array.isArray(data.images) ? data.images : [])
    .filter((item) => item && typeof item.url === 'string' && item.url)
    .map((item, i) => ({
      id: item.id || `${id}-${i}`,
      type: item.type === 'video' ? 'video' : 'image',
      src: item.url,
      full: item.url,
      layoutSize: item.layoutSize || 'standard',
      alt: '',
    }));

  return {
    id,
    source: 'cms',
    title: normalizeTitle(data.title) || 'UNTITLED',
    description: typeof data.description === 'string' ? data.description.trim() : '',
    category: typeof data.category === 'string' ? data.category.trim() : '',
    media,
  };
}

// A project needs at least one photograph to have a cover.
export const hasCover = (project) => project.media.some((m) => m.type === 'image');

// Featured (bundled) projects come first in their original order. A CMS project
// with the same title replaces its featured counterpart in place, since the CMS
// is where the studio edits content; other CMS projects follow in createdAt order.
export function mergeProjects(featured, cms) {
  const usable = cms.filter(hasCover);
  const byTitle = new Map(usable.map((p) => [normalizeTitle(p.title), p]));
  const used = new Set();

  const merged = featured.map((project) => {
    const override = byTitle.get(normalizeTitle(project.title));
    if (!override) return project;
    used.add(override.id);
    return { ...override, category: override.category || project.category };
  });

  return merged.concat(usable.filter((p) => !used.has(p.id)));
}

export const categoriesOf = (projects) =>
  [...new Set(projects.map((p) => p.category).filter(Boolean))];

// Client-side pre-check for admin uploads. storage.rules enforces the same
// limits server-side; this just gives a clear message before uploading.
export function validateUpload(file) {
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');
  if (!isImage && !isVideo) return `${file.name}: only image or video files can be uploaded.`;
  const limit = isImage ? LIMITS.imageBytes : LIMITS.videoBytes;
  if (file.size > limit) {
    return `${file.name}: ${isImage ? 'images' : 'videos'} must be under ${Math.round(limit / 1024 / 1024)} MB.`;
  }
  return null;
}

export function validateProjectFields({ title, description = '', category = '' }) {
  const errors = {};
  const t = normalizeTitle(title);
  if (!t) errors.title = 'Give the collection a title.';
  else if (t.length > LIMITS.title) errors.title = `Keep the title under ${LIMITS.title} characters.`;
  if (description.length > LIMITS.description) errors.description = `Keep the description under ${LIMITS.description} characters.`;
  if (category.trim().length > LIMITS.category) errors.category = `Keep the category under ${LIMITS.category} characters.`;
  return errors;
}

// Same storage path for the same file name, made unique per upload.
export const storagePathFor = (projectId, mediaId, fileName) =>
  `portfolio/${projectId}/${mediaId}-${fileName.replace(/[^\w.-]+/g, '_')}`;
