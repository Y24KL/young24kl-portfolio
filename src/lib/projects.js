// Pure helpers shared by the public portfolio and the /admin CMS.
// Covered by tests/projects.test.js.

export const LIMITS = {
  title: 120,
  description: 2000,
  category: 60,
  imageBytes: 25 * 1024 * 1024, // keep in sync with storage.rules
  videoBytes: 500 * 1024 * 1024,
};

const str = (v) => (typeof v === 'string' && v ? v : undefined);
const num = (v) => (Number.isFinite(v) && v > 0 ? v : undefined);

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
      full: str(item.full) || item.url,
      // Imported built-in photos also carry responsive renditions.
      srcSet: str(item.srcSet),
      placeholder: str(item.placeholder),
      width: num(item.width),
      height: num(item.height),
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

// Built-in projects ship with the site. Until they have been imported into the
// CMS, they come first in their original order; a CMS project with the same
// title replaces its built-in counterpart in place, and other CMS projects
// follow in createdAt order. Once imported (settings/site.featuredImported),
// the CMS is the only source, so deleting a project there removes it.
// `key` keeps React keys stable when a CMS copy takes over a built-in card.
export function mergeProjects(featured, cms, { featuredImported = false } = {}) {
  const usable = cms.filter(hasCover);
  const featuredByTitle = new Map(featured.map((p) => [normalizeTitle(p.title), p]));
  const keyed = usable.map((p) => {
    const twin = featuredByTitle.get(normalizeTitle(p.title));
    return twin ? { ...p, key: twin.id, category: p.category || twin.category } : p;
  });
  if (featuredImported) return keyed;

  const byTitle = new Map(keyed.map((p) => [normalizeTitle(p.title), p]));
  const used = new Set();
  const merged = featured.map((project) => {
    const override = byTitle.get(normalizeTitle(project.title));
    if (!override) return project;
    used.add(override.id);
    return override;
  });

  return merged.concat(keyed.filter((p) => !used.has(p.id)));
}

// Firestore document for a built-in project, preserving photo order and the
// responsive renditions under /portfolio. `createdAt` decides its position.
export function featuredToCmsDoc(project, createdAt) {
  return {
    title: normalizeTitle(project.title),
    category: project.category || '',
    description: project.description || '',
    createdAt,
    updatedAt: createdAt,
    images: project.media.map((m) => {
      const item = { id: `builtin-${m.id}`, url: m.src, type: 'image', layoutSize: 'standard' };
      if (m.full) item.full = m.full;
      if (m.srcSet) item.srcSet = m.srcSet;
      if (m.placeholder) item.placeholder = m.placeholder;
      if (m.width) item.width = m.width;
      if (m.height) item.height = m.height;
      return item;
    }),
  };
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
