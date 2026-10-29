import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle, ArrowLeft, Download, ArrowRight, ExternalLink, Film, FolderPlus, Image as ImageIcon,
  LayoutGrid, LogOut, RefreshCw, Save, Star, Trash2, UploadCloud,
} from 'lucide-react';

// Firebase Imports
import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { db } from './firebase';
import { storage } from './firebaseAdmin';

import logo from './assets/logo.webp';
import { Spinner, Toasts } from './admin/ui';
import { useConfirm, useToasts } from './admin/hooks';
import { LIMITS, featuredToCmsDoc, normalizeTitle, storagePathFor, validateProjectFields, validateUpload } from './lib/projects';
import { featuredProjects } from './data/content';

const now = () => new Date().toISOString();
const LAYOUT_SIZES = ['standard', 'wide', 'tall'];

const fieldCls = 'w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-base text-bone outline-none transition placeholder:text-dim focus:border-gold-pale focus:ring-4 focus:ring-gold/10 md:text-sm';
const labelCls = 'mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-mist';
const iconBtn = 'grid h-9 w-9 place-items-center rounded-lg text-mist transition hover:bg-white/10 hover:text-bone disabled:pointer-events-none disabled:opacity-30';

// Firebase error codes → something an editor can act on.
function explain(error) {
  const code = error?.code || '';
  if (code.includes('permission-denied') || code.includes('unauthorized')) return 'Permission denied. Your account may no longer be an administrator — sign out and back in.';
  if (code.includes('unauthenticated')) return 'Your session expired. Sign in again.';
  if (code.includes('quota-exceeded')) return 'Storage quota exceeded on the Firebase project.';
  if (code.includes('unavailable') || code.includes('retry-limit-exceeded') || code.includes('network')) return 'Network problem. Check your connection and try again.';
  if (code === 'storage/bucket-not-found' || code === 'storage/project-not-found' || code === 'storage/unknown') return 'Firebase Storage is not set up for this project, so media can’t be uploaded yet.';
  if (code === 'storage/canceled') return 'Upload cancelled.';
  return error?.message || 'Something went wrong.';
}

/* ---------------------------------------------------------------- Create */

const CreateCollection = ({ onCreated, push }) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    const errors = validateProjectFields({ title });
    if (errors.title) { setError(errors.title); return; }
    setError('');
    setBusy(true);
    try {
      const stamp = now();
      const created = await addDoc(collection(db, 'projects'), {
        title: normalizeTitle(title),
        images: [],
        createdAt: stamp,
        updatedAt: stamp,
      });
      setTitle('');
      onCreated(created.id);
      push('success', `Created “${normalizeTitle(title)}”. Add media to publish it on the site.`);
    } catch (err) {
      push('error', `Couldn’t create the collection. ${explain(err)}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate>
      <label htmlFor="new-collection" className={labelCls}>New collection</label>
      <div className="flex gap-2">
        <input
          id="new-collection"
          value={title}
          maxLength={LIMITS.title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Unilag Concert"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'new-collection-error' : undefined}
          className={fieldCls}
        />
        <button type="submit" disabled={busy} aria-label="Create collection" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold-light text-ink transition hover:bg-gold disabled:opacity-50">
          {busy ? <Spinner /> : <FolderPlus className="h-5 w-5" />}
        </button>
      </div>
      {error && <p id="new-collection-error" className="mt-2 text-xs text-red-300">{error}</p>}
    </form>
  );
};

/* --------------------------------------------------------------- Details */

const DetailsEditor = ({ project, push }) => {
  const initial = { title: project.title || '', category: project.category || '', description: project.description || '' };
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const dirty = Object.keys(initial).some((k) => values[k] !== initial[k]);

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    if (busy || !dirty) return;
    const found = validateProjectFields(values);
    setErrors(found);
    if (Object.keys(found).length) return;
    setBusy(true);
    try {
      await updateDoc(doc(db, 'projects', project.id), {
        title: normalizeTitle(values.title),
        category: values.category.trim(),
        description: values.description.trim(),
        updatedAt: now(),
      });
      push('success', 'Details saved and live on the site.');
    } catch (err) {
      push('error', `Couldn’t save details. ${explain(err)}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={save} noValidate className="grid gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.015] p-5 md:grid-cols-2 md:p-6">
      <div>
        <label htmlFor="p-title" className={labelCls}>Title</label>
        <input id="p-title" value={values.title} onChange={set('title')} maxLength={LIMITS.title} aria-invalid={errors.title ? 'true' : 'false'} className={fieldCls} />
        {errors.title && <p className="mt-1.5 text-xs text-red-300">{errors.title}</p>}
      </div>
      <div>
        <label htmlFor="p-category" className={labelCls}>Category <span className="normal-case tracking-normal text-dim">(optional — e.g. Sports, Events, Brand)</span></label>
        <input id="p-category" value={values.category} onChange={set('category')} maxLength={LIMITS.category} className={fieldCls} />
        {errors.category && <p className="mt-1.5 text-xs text-red-300">{errors.category}</p>}
      </div>
      <div className="md:col-span-2">
        <label htmlFor="p-description" className={labelCls}>Description <span className="normal-case tracking-normal text-dim">(optional, shown on the project page)</span></label>
        <textarea id="p-description" rows={3} value={values.description} onChange={set('description')} maxLength={LIMITS.description} className={`${fieldCls} resize-y`} />
        <p className="mt-1.5 text-right text-[11px] text-dim">{values.description.length} / {LIMITS.description}</p>
      </div>
      <div className="flex items-center justify-end gap-3 md:col-span-2">
        {dirty && !busy && (
          <button type="button" onClick={() => { setValues(initial); setErrors({}); }} className="min-h-10 rounded-lg px-3 text-sm text-mist hover:text-bone">
            Discard
          </button>
        )}
        <button type="submit" disabled={!dirty || busy} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-gold-light px-4 text-sm font-semibold text-ink transition hover:bg-gold disabled:opacity-40">
          {busy ? <Spinner /> : <Save className="h-4 w-4" />} {busy ? 'Saving…' : 'Save details'}
        </button>
      </div>
    </form>
  );
};

/* ---------------------------------------------------------------- Upload */

const Uploader = ({ project, push }) => {
  const inputRef = useRef(null);
  const [queue, setQueue] = useState([]); // { key, name, progress, state }
  const [dragging, setDragging] = useState(false);
  const busy = queue.some((q) => q.state === 'uploading' || q.state === 'waiting');

  const patch = (key, changes) => setQueue((q) => q.map((item) => (item.key === key ? { ...item, ...changes } : item)));

  const uploadOne = (file, key) => new Promise((resolve, reject) => {
    const mediaId = `media-${crypto.randomUUID()}`;
    const storagePath = storagePathFor(project.id, mediaId, file.name);
    const task = uploadBytesResumable(ref(storage, storagePath), file, { contentType: file.type });
    task.on(
      'state_changed',
      (snap) => patch(key, { progress: snap.totalBytes ? snap.bytesTransferred / snap.totalBytes : 0 }),
      reject,
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          const item = {
            id: mediaId,
            url,
            storagePath,
            type: file.type.startsWith('video/') ? 'video' : 'image',
            layoutSize: 'standard',
          };
          try {
            // arrayUnion appends atomically, so concurrent edits are never overwritten.
            await updateDoc(doc(db, 'projects', project.id), { images: arrayUnion(item), updatedAt: now() });
          } catch (err) {
            await deleteObject(task.snapshot.ref).catch(() => {});
            throw err;
          }
          resolve();
        } catch (err) {
          reject(err);
        }
      }
    );
  });

  const handleFiles = async (fileList) => {
    if (busy) return;
    const files = Array.from(fileList || []);
    if (!files.length) return;

    const problems = files.map(validateUpload).filter(Boolean);
    const valid = files.filter((f) => !validateUpload(f));
    problems.forEach((p) => push('error', p));
    const room = 200 - (project.images?.length || 0);
    if (valid.length > room) {
      push('error', `A collection can hold up to 200 items; only the first ${Math.max(room, 0)} will be uploaded.`);
      valid.splice(Math.max(room, 0));
    }
    if (!valid.length) return;

    const items = valid.map((f, i) => ({ key: `${Date.now()}-${i}`, name: f.name, progress: 0, state: 'waiting' }));
    setQueue(items);

    let ok = 0;
    const failures = [];
    for (let i = 0; i < valid.length; i++) {
      patch(items[i].key, { state: 'uploading' });
      try {
        await uploadOne(valid[i], items[i].key);
        patch(items[i].key, { state: 'done', progress: 1 });
        ok++;
      } catch (err) {
        console.error('Upload failed:', err);
        patch(items[i].key, { state: 'failed' });
        failures.push(`${valid[i].name}: ${explain(err)}`);
      }
    }

    if (ok) push('success', `${ok} file${ok === 1 ? '' : 's'} uploaded to “${project.title}”.`);
    if (failures.length) push('error', `${failures.length} upload${failures.length === 1 ? '' : 's'} failed. ${failures[0]}`);
    setTimeout(() => setQueue((q) => q.filter((x) => x.state === 'failed')), 2500);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        className={`flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed p-6 text-center transition md:flex-row md:justify-between md:text-left ${
          dragging ? 'border-gold-light bg-gold/[0.06]' : 'border-white/10'
        }`}
      >
        <div className="flex items-center gap-3">
          <UploadCloud className="h-6 w-6 shrink-0 text-gold" />
          <p className="text-sm text-mist">
            Drag photos or videos here, or choose files.
            <span className="block text-xs text-dim">Images up to {LIMITS.imageBytes / 1024 / 1024} MB · videos up to {LIMITS.videoBytes / 1024 / 1024} MB</span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl bg-gold-light px-5 text-sm font-semibold text-ink transition hover:bg-gold disabled:opacity-50"
        >
          {busy ? <Spinner /> : <UploadCloud className="h-4 w-4" />}
          {busy ? 'Uploading…' : 'Upload media'}
        </button>
        <input ref={inputRef} type="file" multiple accept="image/*,video/*" className="sr-only" tabIndex={-1} onChange={(e) => handleFiles(e.target.files)} />
      </div>

      {queue.length > 0 && (
        <ul className="mt-3 space-y-2" aria-live="polite" aria-label="Upload progress">
          {queue.map((q) => (
            <li key={q.key} className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-xs">
              <div className="mb-1.5 flex justify-between gap-3">
                <span className="truncate text-mist">{q.name}</span>
                <span className={q.state === 'failed' ? 'text-red-300' : q.state === 'done' ? 'text-emerald-300' : 'text-dim'}>
                  {q.state === 'failed' ? 'Failed' : q.state === 'done' ? 'Done' : q.state === 'waiting' ? 'Waiting' : `${Math.round(q.progress * 100)}%`}
                </span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-white/10">
                <div className={`h-full rounded-full transition-[width] duration-300 ${q.state === 'failed' ? 'bg-red-400' : 'bg-gold-light'}`} style={{ width: `${Math.round(q.progress * 100)}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/* ----------------------------------------------------------------- Media */

const MediaGrid = ({ project, push, confirm }) => {
  const [pending, setPending] = useState(false);
  const images = project.images || [];

  const writeImages = async (next, message) => {
    if (pending) return;
    setPending(true);
    try {
      await updateDoc(doc(db, 'projects', project.id), { images: next, updatedAt: now() });
      if (message) push('success', message);
    } catch (err) {
      push('error', `Couldn’t update the collection. ${explain(err)}`);
    } finally {
      setPending(false);
    }
  };

  const move = (from, to) => {
    if (to < 0 || to >= images.length) return;
    const next = [...images];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    writeImages(next, to === 0 ? 'Cover updated.' : undefined);
  };

  const setSize = (id, layoutSize) => writeImages(images.map((m) => (m.id === id ? { ...m, layoutSize } : m)));

  const remove = (item, index) =>
    confirm.ask({
      title: 'Delete this media?',
      body: <>Item {index + 1} will be removed from “{project.title}” and its file deleted from storage. This can’t be undone.</>,
      confirmLabel: 'Delete',
      danger: true,
      action: async () => {
        try {
          await updateDoc(doc(db, 'projects', project.id), { images: arrayRemove(item), updatedAt: now() });
        } catch (err) {
          push('error', `Couldn’t delete. ${explain(err)}`);
          throw err;
        }
        if (item.storagePath) {
          try {
            await deleteObject(ref(storage, item.storagePath));
          } catch (err) {
            if (err?.code !== 'storage/object-not-found') {
              push('error', `Removed from the collection, but the stored file couldn’t be deleted (${explain(err)}).`);
              return;
            }
          }
        }
        push('success', 'Media deleted.');
      },
    });

  if (!images.length) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-white/[0.06] p-12 text-center">
        <ImageIcon className="mb-3 h-10 w-10 text-graphite" />
        <h3 className="font-semibold text-mist">This collection is empty</h3>
        <p className="mt-1 max-w-sm text-sm text-dim">It won’t appear on the public site until it has at least one photo. Upload media above.</p>
      </div>
    );
  }

  return (
    <ul className={`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 ${pending ? 'opacity-70' : ''}`} aria-busy={pending}>
      {images.map((item, index) => (
        <motion.li
          layout
          transition={{ duration: 0.3 }}
          key={item.id || item.url}
          className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#121214]"
        >
          <div className="relative aspect-[4/3] bg-black">
            {item.type === 'video' ? (
              <video src={item.url} muted playsInline preload="metadata" className="h-full w-full object-cover" />
            ) : (
              <img src={item.url} alt={`Item ${index + 1} in ${project.title}`} loading="lazy" className="h-full w-full object-cover" />
            )}
            <span className="absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-md bg-black/70 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-bone backdrop-blur">
              {item.type === 'video' ? <Film className="h-3 w-3 text-gold" /> : <ImageIcon className="h-3 w-3 text-gold" />}
              {index + 1}
            </span>
            {index === 0 && (
              <span className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-md bg-gold-light px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-ink">
                <Star className="h-3 w-3" /> Cover
              </span>
            )}
          </div>

          {/* Controls are always visible — no hover-only actions on touch screens. */}
          <div className="flex flex-wrap items-center gap-1 p-2">
            <button type="button" className={iconBtn} disabled={pending || index === 0} onClick={() => move(index, index - 1)} aria-label={`Move item ${index + 1} earlier`}>
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button type="button" className={iconBtn} disabled={pending || index === images.length - 1} onClick={() => move(index, index + 1)} aria-label={`Move item ${index + 1} later`}>
              <ArrowRight className="h-4 w-4" />
            </button>
            {item.type !== 'video' && (
              <button type="button" className={iconBtn} disabled={pending || index === 0} onClick={() => move(index, 0)} aria-label={`Use item ${index + 1} as cover`} title="Use as cover">
                <Star className="h-4 w-4" />
              </button>
            )}
            <label className="sr-only" htmlFor={`size-${item.id}`}>Layout size for item {index + 1}</label>
            <select
              id={`size-${item.id}`}
              value={item.layoutSize || 'standard'}
              disabled={pending}
              onChange={(e) => setSize(item.id, e.target.value)}
              className="ml-auto h-9 rounded-lg border border-white/10 bg-black/40 px-2 text-xs capitalize text-bone outline-none focus:border-gold-pale"
            >
              {LAYOUT_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <button type="button" className={`${iconBtn} hover:!bg-red-500/20 hover:!text-red-300`} disabled={pending} onClick={() => remove(item, index)} aria-label={`Delete item ${index + 1}`}>
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </motion.li>
      ))}
    </ul>
  );
};

/* ---------------------------------------------------------------- Import */

// One-time move of the built-in projects into the CMS. Their photos stay at
// /portfolio/... (shipped with the site), so this works without Storage.
// Projects plus the settings flag are written in a single atomic batch.
const ImportBuiltIn = ({ projects, push, onImported }) => {
  const [busy, setBusy] = useState(false);
  const existing = new Set(projects.map((p) => normalizeTitle(p.title)));
  const missing = featuredProjects.filter((p) => !existing.has(normalizeTitle(p.title)));

  const run = async () => {
    if (busy) return;
    setBusy(true);
    try {
      // Place them before any existing collections, keeping their order.
      const earliest = projects.reduce((min, p) => Math.min(min, Date.parse(p.createdAt) || Infinity), Date.now());
      const batch = writeBatch(db);
      let firstId = null;
      missing.forEach((project, i) => {
        const ref = doc(collection(db, 'projects'));
        firstId ??= ref.id;
        const createdAt = new Date(earliest - (missing.length - i) * 1000).toISOString();
        batch.set(ref, featuredToCmsDoc(project, createdAt));
      });
      batch.set(doc(db, 'settings', 'site'), { featuredImported: true, updatedAt: now() });
      await batch.commit();
      push('success', missing.length
        ? `Imported ${missing.length} project${missing.length === 1 ? '' : 's'}. They’re now fully editable here.`
        : 'Built-in projects are now managed here.');
      if (firstId) onImported(firstId);
    } catch (err) {
      push('error', `Import failed — nothing was changed. ${explain(err)}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mb-8 rounded-2xl border border-gold/25 bg-gold/[0.05] p-5 md:p-6">
      <h2 className="flex items-center gap-2 font-semibold text-bone">
        <Download className="h-4 w-4 text-gold" /> Your built-in projects aren’t editable yet
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mist">
        {featuredProjects.map((p) => p.title).join(', ')} ship with the website itself, so they don’t appear in this list.
        Import them once to rename, reorder, re-cover or delete them here. The public site will look the same.
      </p>
      <button
        type="button"
        onClick={run}
        disabled={busy}
        className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg bg-gold-light px-4 text-sm font-semibold text-ink transition hover:bg-gold disabled:opacity-50"
      >
        {busy ? <Spinner /> : <Download className="h-4 w-4" />}
        {busy
          ? 'Importing…'
          : missing.length
            ? `Import ${missing.length} built-in project${missing.length === 1 ? '' : 's'}`
            : 'Manage them here'}
      </button>
    </div>
  );
};

/* ------------------------------------------------------------- Dashboard */

const AdminDashboard = ({ user, projects, status, loadError, featuredImported, onSignOut }) => {
  const { toasts, push, dismiss } = useToasts();
  const confirm = useConfirm();
  const [activeId, setActiveId] = useState(null);
  const active = projects.find((p) => p.id === activeId) ?? projects[0] ?? null;

  const deleteProject = (project) =>
    confirm.ask({
      title: `Delete “${project.title}”?`,
      body: <>The collection and all {project.images?.length || 0} of its media files will be permanently removed from the site and storage.</>,
      confirmLabel: 'Delete collection',
      danger: true,
      requireText: project.title,
      action: async () => {
        try {
          await deleteDoc(doc(db, 'projects', project.id));
        } catch (err) {
          push('error', `Couldn’t delete the collection. ${explain(err)}`);
          throw err;
        }
        const results = await Promise.allSettled(
          (project.images || []).filter((m) => m.storagePath).map((m) => deleteObject(ref(storage, m.storagePath)))
        );
        const leftover = results.filter((r) => r.status === 'rejected' && r.reason?.code !== 'storage/object-not-found').length;
        if (activeId === project.id) setActiveId(null);
        push(leftover ? 'error' : 'success', leftover
          ? `Collection deleted, but ${leftover} stored file${leftover === 1 ? '' : 's'} couldn’t be removed from Storage.`
          : `Deleted “${project.title}”.`);
      },
    });

  return (
    <div className="min-h-[100svh] bg-[#08080a] text-bone">
      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#08080a]/85 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt="" className="h-9 w-9" />
            <p className="font-display text-lg font-bold"><span className="text-gold-light">24KL</span> <span className="font-sans text-[0.6em] font-semibold tracking-[0.3em]">VISUALS</span> <span className="ml-1 font-sans text-xs font-medium uppercase tracking-[0.2em] text-dim">CMS</span></p>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="hidden max-w-[16rem] truncate text-xs text-dim md:block">{user.email}</span>
            <a href="/#work" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-1.5 rounded-lg px-3 text-xs font-medium text-mist hover:bg-white/5 hover:text-bone">
              <ExternalLink className="h-3.5 w-3.5" /> <span className="hidden sm:inline">View site</span>
            </a>
            <button type="button" onClick={onSignOut} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-white/10 px-3 text-xs font-medium text-bone hover:bg-white/5">
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="md:flex">
        <aside className="border-b border-white/[0.06] p-4 md:sticky md:top-16 md:h-[calc(100svh-4rem)] md:w-80 md:shrink-0 md:overflow-y-auto md:border-b-0 md:border-r md:p-6">
          <CreateCollection push={push} onCreated={setActiveId} />

          <h2 className={`${labelCls} mt-8`}>Collections {status === 'ready' && <span className="text-dim">({projects.length})</span>}</h2>
          {status === 'loading' && (
            <ul className="space-y-2" aria-label="Loading collections">
              {[0, 1, 2].map((i) => <li key={i} className="h-12 animate-pulse rounded-xl bg-white/[0.04]" />)}
            </ul>
          )}
          {status === 'ready' && projects.length === 0 && (
            <p className="rounded-xl border border-white/[0.06] p-4 text-sm text-dim">No CMS collections yet. Create one above.</p>
          )}
          <ul className="max-h-64 space-y-1 overflow-y-auto md:max-h-none">
            {projects.map((proj) => {
              const selected = active?.id === proj.id;
              const count = proj.images?.length || 0;
              return (
                <li key={proj.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(proj.id)}
                    aria-current={selected ? 'true' : undefined}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-3 text-left transition ${
                      selected ? 'border-gold/30 bg-gold/10 text-bone' : 'border-transparent text-mist hover:bg-white/[0.03] hover:text-bone'
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold tracking-wide">{proj.title}</span>
                      <span className={`text-[11px] ${count ? 'text-dim' : 'text-amber-300/80'}`}>
                        {count ? `${count} item${count === 1 ? '' : 's'} · live` : 'Empty · hidden from site'}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <main className="min-w-0 flex-1 p-4 md:p-8 lg:p-10">
          {status === 'error' ? (
            <div role="alert" className="mx-auto max-w-lg rounded-2xl border border-red-400/20 bg-red-500/[0.06] p-8 text-center">
              <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-red-300" />
              <h1 className="text-lg font-semibold">Couldn’t load collections</h1>
              <p className="mt-2 text-sm text-mist">{loadError}</p>
              <button type="button" onClick={() => window.location.reload()} className="mt-6 inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/10 px-4 text-sm hover:bg-white/5">
                <RefreshCw className="h-4 w-4" /> Reload
              </button>
            </div>
          ) : status === 'loading' ? (
            <div className="space-y-4" aria-label="Loading">
              <div className="h-10 w-72 animate-pulse rounded-lg bg-white/[0.04]" />
              <div className="h-40 animate-pulse rounded-2xl bg-white/[0.03]" />
            </div>
          ) : (
            <>
          {status === 'ready' && featuredImported === false && (
            <ImportBuiltIn projects={projects} push={push} onImported={setActiveId} />
          )}
          {active ? (
            <div className="space-y-8">
              <div className="flex flex-col gap-4 border-b border-white/[0.06] pb-6 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                  <p className={labelCls}>Collection</p>
                  <h1 className="truncate font-display text-3xl font-semibold md:text-4xl">{active.title}</h1>
                  <p className="mt-1 text-sm text-dim">
                    {(active.images?.length || 0) > 0 ? 'Live on the public site.' : 'Hidden from the public site until it has a photo.'} Changes publish instantly.
                  </p>
                </div>
                <button type="button" onClick={() => deleteProject(active)} className="inline-flex min-h-10 shrink-0 items-center gap-2 self-start rounded-lg border border-red-400/25 px-3 text-sm text-red-300 transition hover:bg-red-500/10">
                  <Trash2 className="h-4 w-4" /> Delete collection
                </button>
              </div>

              <DetailsEditor key={`${active.id}:${active.updatedAt || ''}`} project={active} push={push} />
              <Uploader key={active.id} project={active} push={push} />

              <section aria-labelledby="media-title">
                <div className="mb-4 flex items-baseline justify-between">
                  <h2 id="media-title" className="text-sm font-semibold uppercase tracking-[0.18em] text-mist">Media &amp; order</h2>
                  <p className="text-xs text-dim">First photo is the cover. Order here is the order on the site.</p>
                </div>
                <MediaGrid project={active} push={push} confirm={confirm} />
              </section>
            </div>
          ) : (
            <div className="flex flex-col items-center py-24 text-center">
              <LayoutGrid className="mb-4 h-12 w-12 text-graphite" />
              <h1 className="text-xl font-semibold text-mist">No collections yet</h1>
              <p className="mt-2 max-w-sm text-sm text-dim">
                Import your built-in projects above, or create a new collection from the sidebar.
              </p>
            </div>
          )}
            </>
          )}
        </main>
      </div>

      {confirm.dialog}
      <Toasts toasts={toasts} dismiss={dismiss} />
    </div>
  );
};

export default AdminDashboard;
