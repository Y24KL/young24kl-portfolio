import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, ArrowLeft, ArrowRight, UploadCloud, Image as ImageIcon, Film, Layout, Grid, Loader2 } from 'lucide-react';

// Firebase Imports
import { collection, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';

const AdminDashboard = ({ projects, onExit }) => {
  const [activeProjectId, setActiveProjectId] = useState(projects[0]?.id || null);
  const [newProjectName, setNewProjectName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const activeProject = projects.find(p => p.id === activeProjectId);

  // 1. Create a New Collection in Firestore
  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    
    try {
      const docRef = await addDoc(collection(db, "projects"), {
        title: newProjectName.toUpperCase(),
        images: [],
        createdAt: new Date().toISOString()
      });
      setActiveProjectId(docRef.id);
      setNewProjectName('');
    } catch (error) {
      alert("Error creating project: " + error.message);
    }
  };

  // 2. Delete Project from Firestore
  const handleDeleteProject = async (id) => {
    if (window.confirm("Are you sure you want to delete this collection and ALL its media?")) {
      try {
        await deleteDoc(doc(db, "projects", id));
        if (activeProjectId === id) setActiveProjectId(null);
      } catch (error) {
        alert("Error deleting: " + error.message);
      }
    }
  };

  // 3. Upload Media to Storage -> Save URL to Firestore
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length || !activeProjectId || !activeProject) return;

    setIsUploading(true);
    let updatedImages = [...(activeProject.images || [])];

    for (let file of files) {
      const isVideo = file.type.startsWith('video/');
      const fileId = `media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const storageRefPath = `portfolio/${activeProjectId}/${fileId}-${file.name}`;
      const storageReference = ref(storage, storageRefPath);

      try {
        // Upload file to Storage Bucket
        const uploadTask = await uploadBytesResumable(storageReference, file);
        const downloadURL = await getDownloadURL(uploadTask.ref);

        // Append to local array structure
        updatedImages.push({
          id: fileId,
          url: downloadURL,
          storagePath: storageRefPath,
          type: isVideo ? 'video' : 'image',
          layoutSize: 'standard'
        });
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }

    // Update the entire array in Firestore
    try {
      await updateDoc(doc(db, "projects", activeProjectId), { images: updatedImages });
    } catch (error) {
      alert("Failed to save layout: " + error.message);
    }
    
    setIsUploading(false);
    // Reset file input
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  // 4. Delete Media Item from Storage & Firestore
  const handleDeleteMedia = async (mediaItem) => {
    if (!activeProject) return;
    
    // Remove from array
    const newImages = activeProject.images.filter(img => img.id !== mediaItem.id);
    
    try {
      // 1. Update document array
      await updateDoc(doc(db, "projects", activeProjectId), { images: newImages });
      // 2. Delete actual file from bucket
      if (mediaItem.storagePath) {
        const fileRef = ref(storage, mediaItem.storagePath);
        await deleteObject(fileRef);
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  // 5. Reorder Media (Array Swap)
  const handleMoveMedia = async (index, direction) => {
    if (!activeProject) return;
    const newImages = [...activeProject.images];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newImages.length) return;
    
    // Swap
    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];

    await updateDoc(doc(db, "projects", activeProjectId), { images: newImages });
  };

  // 6. Change Layout Grid Size
  const handleLayoutSizeChange = async (mediaId, size) => {
    if (!activeProject) return;
    const newImages = activeProject.images.map(img => 
      img.id === mediaId ? { ...img, layoutSize: size } : img
    );
    await updateDoc(doc(db, "projects", activeProjectId), { images: newImages });
  };

  return (
    <div className="min-h-screen bg-[#070707] text-gray-200 font-sans flex flex-col md:flex-row border-t border-white/10">
      
      {/* SIDEBAR */}
      <div className="w-full md:w-80 bg-[#0f0f0f] border-b md:border-b-0 md:border-r border-white/5 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Layout className="text-[#D4AF37] w-5 h-5" /> Studio CMS
            </h2>
            <button onClick={onExit} className="text-xs font-semibold px-3 py-1.5 border border-white/10 rounded-lg hover:bg-white/5 transition">
              Exit Preview
            </button>
          </div>

          <form onSubmit={handleCreateProject} className="mb-8">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">New Collection</label>
            <div className="flex gap-2">
              <input type="text" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} placeholder="e.g. UNILAG CONCERT" className="flex-1 bg-[#161616] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#D4AF37] outline-none" />
              <button type="submit" className="bg-[#D4AF37] hover:opacity-90 text-black p-2.5 rounded-xl"><Plus className="w-5 h-5 stroke-[2.5]" /></button>
            </div>
          </form>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Collections</label>
            {projects.map((proj) => (
              <div key={proj.id} className={`group flex items-center justify-between p-3 rounded-xl transition cursor-pointer ${activeProjectId === proj.id ? 'bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-white' : 'hover:bg-white/[0.02] border border-transparent text-gray-400'}`} onClick={() => setActiveProjectId(proj.id)}>
                <span className="text-sm font-semibold tracking-wide truncate pr-2">{proj.title}</span>
                <button onClick={(e) => { e.stopPropagation(); handleDeleteProject(proj.id); }} className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition p-1"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN WORKSPACE */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto max-h-screen">
        {activeProject ? (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/5">
              <div>
                <h1 className="text-3xl font-black text-white mb-1">{activeProject.title}</h1>
                <p className="text-sm text-gray-400">Manage order, dimensions, and live uploads directly to Firebase.</p>
              </div>
              <div>
                <button onClick={() => fileInputRef.current.click()} disabled={isUploading} className="inline-flex items-center gap-2 bg-gradient-to-r from-[#E5C06B] to-[#B48C36] text-black font-bold px-5 py-3 rounded-xl hover:opacity-90 transition shadow-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                  {isUploading ? 'Uploading to Cloud...' : 'Upload Media Files'}
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} multiple accept="image/*,video/*" className="hidden" />
              </div>
            </div>

            {!activeProject.images || activeProject.images.length === 0 ? (
              <div className="border-2 border-dashed border-white/10 rounded-2xl p-20 text-center flex flex-col items-center justify-center">
                <UploadCloud className="w-12 h-12 text-gray-600 mb-4" />
                <h3 className="text-lg font-bold text-gray-400 mb-1">This collection is empty</h3>
                <p className="text-sm text-gray-500 max-w-sm">Drag and drop or click the upload button above.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[220px]">
                {activeProject.images.map((item, index) => {
                  let gridSpan = "col-span-1 row-span-1";
                  if (item.layoutSize === 'wide') gridSpan = "md:col-span-2 row-span-1";
                  if (item.layoutSize === 'tall') gridSpan = "col-span-1 row-span-2";

                  return (
                    <motion.div layout key={item.id} className={`relative bg-[#121212] rounded-xl overflow-hidden border border-white/10 group ${gridSpan}`}>
                      {item.type === 'video' ? (
                        <video src={item.url} className="w-full h-full object-cover" muted />
                      ) : (
                        <img src={item.url} alt="Uploaded source" className="w-full h-full object-cover" />
                      )}

                      <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] uppercase font-bold text-gray-300 tracking-wider flex items-center gap-1.5">
                        {item.type === 'video' ? <Film className="w-3 h-3 text-[#D4AF37]" /> : <ImageIcon className="w-3 h-3 text-[#D4AF37]" />} {index + 1}
                      </div>

                      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 z-10">
                        <div className="flex justify-end">
                          <button onClick={() => handleDeleteMedia(item)} className="bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white p-1.5 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                        <div className="space-y-2">
                          <span className="block text-[10px] uppercase font-black tracking-widest text-gray-400">Display Blueprint</span>
                          <div className="grid grid-cols-3 gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
                            {['standard', 'wide', 'tall'].map((size) => (
                              <button key={size} onClick={() => handleLayoutSizeChange(item.id, size)} className={`text-[10px] capitalize font-semibold py-1 rounded transition-all ${item.layoutSize === size ? 'bg-[#D4AF37] text-black font-bold' : 'text-gray-400 hover:text-white'}`}>{size}</button>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                          <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Sequence Order</span>
                          <div className="flex gap-1">
                            <button disabled={index === 0} onClick={() => handleMoveMedia(index, 'left')} className="bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none p-1.5 rounded-md transition"><ArrowLeft className="w-3.5 h-3.5" /></button>
                            <button disabled={index === activeProject.images.length - 1} onClick={() => handleMoveMedia(index, 'right')} className="bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none p-1.5 rounded-md transition"><ArrowRight className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center py-20">
            <Grid className="w-12 h-12 text-gray-700 mb-4" />
            <h2 className="text-xl font-bold text-gray-400">No Collection Active</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
