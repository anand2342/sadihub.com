import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Upload, Heart, MessageSquare, X, Trash2, Send, UploadCloud, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { readFileAsDataUrl } from '../../lib/utils';
import { LuxuryCard } from '../common/LuxuryCard';
import { EmptyState } from '../common/EmptyState';
export const Gallery = ({ photos, onBatchUploadPhotos, onBatchUploadFiles, onToggleLike, onAddComment, onDeletePhoto, onToast }) => {
    const { session } = useAuth();
    const userId = session?.user_id;
    const isApproved = session?.profile?.status === 'approved';
    const isFamilyAdmin = session?.roles.includes('family_admin') || session?.roles.includes('super_admin');
    const fileInputRef = useRef(null);
    // Count photos uploaded by current user
    const userPhotoCount = photos.filter(p => p.user_id === userId).length;
    const MAX_PHOTOS = 10;
    // Filter & Sort State
    const [filterMode, setFilterMode] = useState('latest');
    const [activePhoto, setActivePhoto] = useState(null);
    // Upload Modal State
    const [showUploadModal, setShowUploadModal] = useState(false);
    // Each item stores both a preview URL (blob/base64) and optionally the original File
    const [selectedPhotos, setSelectedPhotos] = useState([]);
    const [uploading, setUploading] = useState(false);
    // Comment Input
    const [commentText, setCommentText] = useState('');
    const handleFilesSelect = async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0)
            return;
        const validFiles = files.filter(f => f.type.startsWith('image/'));
        if (validFiles.length === 0) {
            onToast('Please select valid image files (JPG, PNG, WebP).', 'error');
            return;
        }
        const currentTotal = userPhotoCount + selectedPhotos.length;
        const availableSlots = MAX_PHOTOS - currentTotal;
        if (availableSlots <= 0) {
            onToast(`Limit reached! Maximum ${MAX_PHOTOS} photos allowed per member.`, 'error');
            return;
        }
        const filesToProcess = validFiles.slice(0, availableSlots);
        if (validFiles.length > availableSlots) {
            onToast(`Only ${availableSlots} photo slot(s) remaining. Added the first ${availableSlots} files.`, 'info');
        }
        if (onBatchUploadFiles) {
            // Supabase mode: use fast local blob preview URLs (no base64 conversion)
            const newItems = filesToProcess.map((file, idx) => ({
                id: `sel-${Date.now()}-${idx}-${Math.random()}`,
                previewUrl: URL.createObjectURL(file),
                caption: '',
                file,
            }));
            setSelectedPhotos(prev => [...prev, ...newItems]);
            onToast(`${newItems.length} photo(s) added to upload queue!`, 'info');
        }
        else {
            // LocalStorage mode: convert to base64 (compressed)
            try {
                const newItems = await Promise.all(filesToProcess.map(async (file, idx) => ({
                    id: `sel-${Date.now()}-${idx}-${Math.random()}`,
                    previewUrl: await readFileAsDataUrl(file),
                    caption: '',
                })));
                setSelectedPhotos(prev => [...prev, ...newItems]);
                onToast(`${newItems.length} photo(s) added to upload queue!`, 'info');
            }
            catch (err) {
                onToast('Failed to process image files.', 'error');
            }
        }
        // Reset input
        if (fileInputRef.current)
            fileInputRef.current.value = '';
    };
    const handleDrop = async (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files || []);
        if (files.length === 0)
            return;
        const validFiles = files.filter(f => f.type.startsWith('image/'));
        if (validFiles.length === 0) {
            onToast('Please drop valid image files.', 'error');
            return;
        }
        const currentTotal = userPhotoCount + selectedPhotos.length;
        const availableSlots = MAX_PHOTOS - currentTotal;
        if (availableSlots <= 0) {
            onToast(`Limit reached! Maximum ${MAX_PHOTOS} photos allowed per member.`, 'error');
            return;
        }
        const filesToProcess = validFiles.slice(0, availableSlots);
        if (validFiles.length > availableSlots)
            onToast(`Only ${availableSlots} slot(s) remaining. Added first ${availableSlots}.`, 'info');
        if (onBatchUploadFiles) {
            const newItems = filesToProcess.map((file, idx) => ({
                id: `sel-${Date.now()}-${idx}-${Math.random()}`,
                previewUrl: URL.createObjectURL(file),
                caption: '',
                file,
            }));
            setSelectedPhotos(prev => [...prev, ...newItems]);
            onToast(`${newItems.length} photo(s) dropped into upload queue!`, 'info');
        }
        else {
            try {
                const newItems = await Promise.all(filesToProcess.map(async (file, idx) => ({
                    id: `sel-${Date.now()}-${idx}-${Math.random()}`,
                    previewUrl: await readFileAsDataUrl(file),
                    caption: '',
                })));
                setSelectedPhotos(prev => [...prev, ...newItems]);
                onToast(`${newItems.length} photo(s) dropped into upload queue!`, 'info');
            }
            catch (err) {
                onToast('Failed to process dropped image files.', 'error');
            }
        }
    };
    const handleRemoveSelectedPhoto = (id) => {
        setSelectedPhotos(prev => {
            const item = prev.find(p => p.id === id);
            // Revoke blob URL to free memory
            if (item?.previewUrl?.startsWith('blob:'))
                URL.revokeObjectURL(item.previewUrl);
            return prev.filter(p => p.id !== id);
        });
    };
    const handleUpdateCaption = (id, caption) => {
        setSelectedPhotos(prev => prev.map(p => p.id === id ? { ...p, caption } : p));
    };
    const closeUploadModal = () => {
        // Revoke all blob preview URLs
        selectedPhotos.forEach(p => { if (p.previewUrl?.startsWith('blob:'))
            URL.revokeObjectURL(p.previewUrl); });
        setSelectedPhotos([]);
        setShowUploadModal(false);
    };
    // Apply filters
    let filteredPhotos = [...photos];
    if (filterMode === 'liked') {
        filteredPhotos.sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0));
    }
    else if (filterMode === 'my') {
        filteredPhotos = filteredPhotos.filter(p => p.user_id === userId);
    }
    else {
        filteredPhotos.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    const handleUploadSubmit = async (e) => {
        e.preventDefault();
        if (selectedPhotos.length === 0) {
            onToast('Please select at least one photo file first!', 'error');
            return;
        }
        setUploading(true);
        try {
            let uploaded = 0, skipped = 0;
            if (onBatchUploadFiles) {
                // ── Supabase Storage mode: upload actual files ──
                const items = selectedPhotos
                    .filter(p => p.file)
                    .map(p => ({ file: p.file, caption: p.caption.trim() }));
                const result = await onBatchUploadFiles(items);
                uploaded = result.uploaded;
                skipped = result.skipped;
            }
            else {
                // ── LocalStorage mode: batch base64 write ──
                const items = selectedPhotos.map(p => ({ url: p.previewUrl, caption: p.caption.trim() }));
                const result = onBatchUploadPhotos(items);
                uploaded = result.uploaded;
                skipped = result.skipped;
            }
            if (uploaded > 0) {
                const msg = skipped > 0
                    ? `${uploaded} photo(s) uploaded! ${skipped} skipped (10-photo limit reached).`
                    : `${uploaded} photo(s) published to family gallery! 🎉`;
                onToast(msg, 'success');
                closeUploadModal();
            }
            else {
                onToast('Upload failed — you may have reached the 10-photo member limit.', 'error');
            }
        }
        catch (err) {
            onToast(err.message || 'Upload error. Please try again.', 'error');
        }
        finally {
            setUploading(false);
        }
    };
    const handleSendComment = (e) => {
        e.preventDefault();
        if (!activePhoto || !commentText.trim())
            return;
        onAddComment(activePhoto.id, commentText.trim());
        setCommentText('');
    };
    return (<div className="space-y-8 animate-fade-in">
      {/* Header & Upload Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-6">
        <div>
          <span className="text-xs font-bold tracking-widest uppercase text-[var(--gold-dark)] dark:text-[var(--gold-primary)] px-3 py-1 rounded-full border border-[var(--border-gold)] bg-[var(--bg-accent)]">
            Memories & Smiles
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[var(--text-primary)] mt-1">
            Family Photo Gallery
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Every member can share up to 10 wedding memories ({userPhotoCount}/{MAX_PHOTOS} uploaded)
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Upload Button */}
          <button onClick={() => {
            if (userPhotoCount >= MAX_PHOTOS) {
                onToast(`10 Photo limit reached for your member account!`, 'error');
                return;
            }
            setShowUploadModal(true);
        }} disabled={!isApproved} className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gold-gradient text-white font-medium text-xs shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer gold-shadow">
              <Upload className="w-4 h-4"/>
              <span>Upload Photo ({userPhotoCount}/{MAX_PHOTOS})</span>
            </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
        <div className="flex items-center gap-2">
          <button onClick={() => setFilterMode('latest')} className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${filterMode === 'latest'
            ? 'bg-gold-gradient text-white shadow'
            : 'border border-[var(--border-gold)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-accent)]'}`}>
            Latest Photos
          </button>
          <button onClick={() => setFilterMode('liked')} className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${filterMode === 'liked'
            ? 'bg-gold-gradient text-white shadow'
            : 'border border-[var(--border-gold)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-accent)]'}`}>
            Most Liked
          </button>
          <button onClick={() => setFilterMode('my')} className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${filterMode === 'my'
            ? 'bg-gold-gradient text-white shadow'
            : 'border border-[var(--border-gold)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-accent)]'}`}>
            My Uploads ({userPhotoCount})
          </button>
        </div>
      </div>

      {/* Photos Grid */}
      {filteredPhotos.length === 0 ? (<EmptyState icon={ImageIcon} title="No Photos Available" description="Be the first family member to upload a wedding photo!" actionText="Upload First Photo" onAction={() => setShowUploadModal(true)}/>) : (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo) => {
                const isOwner = photo.user_id === userId;
                return (<LuxuryCard key={photo.id} className="p-0 overflow-hidden group border border-[var(--border-gold)] flex flex-col justify-between">
                <div onClick={() => setActivePhoto(photo)} className="relative h-64 overflow-hidden cursor-pointer bg-stone-900">
                  <img src={photo.photo_url} alt={photo.caption || 'Gallery photo'} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity"/>

                  {/* Caption & Uploader Badge */}
                  <div className="absolute bottom-3 left-3 right-3 text-white space-y-1">
                    <p className="text-xs font-medium line-clamp-1">
                      {photo.caption || 'Family Memory'}
                    </p>
                    <p className="text-[10px] text-amber-200">
                      By {photo.user_full_name || 'Family Member'}
                    </p>
                  </div>

                  {(isOwner || isFamilyAdmin) && onDeletePhoto && (<button onClick={(e) => {
                            e.stopPropagation();
                            onDeletePhoto(photo.id);
                            onToast('Photo deleted from gallery.', 'info');
                        }} className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 backdrop-blur-md text-red-400 hover:text-red-300 border border-white/20 transition-all cursor-pointer opacity-0 group-hover:opacity-100" title="Delete photo">
                      <Trash2 className="w-4 h-4"/>
                    </button>)}
                </div>

                {/* Actions Footer */}
                <div className="p-4 flex items-center justify-between border-t border-[var(--border-subtle)] text-xs">
                  <button onClick={() => onToggleLike(photo.id)} className={`flex items-center gap-1.5 font-semibold transition-colors cursor-pointer ${photo.user_has_liked
                        ? 'text-rose-500'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>
                    <Heart className={`w-4 h-4 ${photo.user_has_liked ? 'fill-current' : ''}`}/>
                    <span>{photo.likes_count || 0} Likes</span>
                  </button>

                  <button onClick={() => setActivePhoto(photo)} className="flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] font-semibold cursor-pointer">
                    <MessageSquare className="w-4 h-4 text-[var(--gold-dark)]"/>
                    <span>{photo.comments?.length || 0} Comments</span>
                  </button>
                </div>
              </LuxuryCard>);
            })}
        </div>)}

      {/* UPLOAD MULTIPLE PHOTOS MODAL */}
      {showUploadModal && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-xl bg-[var(--bg-card)] border border-[var(--border-gold)] rounded-2xl p-6 shadow-2xl space-y-4 my-8 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] shrink-0">
              <div>
                <h3 className="font-serif font-bold text-lg text-[var(--text-primary)]">
                  Batch Upload Photos ({userPhotoCount + selectedPhotos.length}/{MAX_PHOTOS})
                </h3>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Select & upload multiple photos at once! (Max {MAX_PHOTOS} total per member)
                </p>
              </div>
              <button onClick={() => closeUploadModal()} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer">
                <X className="w-5 h-5"/>
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 overflow-y-auto flex-1 pr-1">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                  Select Multiple Photo Files from Device *
                </label>

                {/* Hidden File Input supporting multiple file selection */}
                <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFilesSelect} className="hidden"/>

                {/* Interactive Drag & Drop Box */}
                <div onClick={() => fileInputRef.current?.click()} onDragOver={e => e.preventDefault()} onDrop={handleDrop} className="p-6 border-2 border-dashed border-[var(--border-gold)] rounded-2xl bg-[var(--bg-accent)] text-center cursor-pointer hover:bg-[var(--gold-light)]/40 transition-all space-y-2 group gold-shadow">
                  <UploadCloud className="w-10 h-10 text-[var(--gold-dark)] dark:text-[var(--gold-primary)] mx-auto group-hover:scale-110 transition-transform"/>
                  <div>
                    <p className="text-sm font-bold text-[var(--text-primary)]">
                      Click to Choose Multiple Photo Files
                    </p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      or drag & drop multiple JPG, PNG, WebP photos here
                    </p>
                  </div>
                </div>
              </div>

              {/* MULTIPLE SELECTED PHOTOS GRID PREVIEW */}
              {selectedPhotos.length > 0 && (<div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-[var(--text-primary)]">
                    <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle className="w-4 h-4"/>
                      {selectedPhotos.length} Photo(s) Ready to Upload:
                    </span>
                    <button type="button" onClick={() => setSelectedPhotos([])} className="text-xs text-red-500 hover:underline cursor-pointer font-normal">
                      Clear Selection
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-72 overflow-y-auto p-1">
                    {selectedPhotos.map((item, index) => (<div key={item.id} className="relative group bg-[var(--bg-primary)] border border-[var(--border-gold)] rounded-xl p-2 space-y-1.5 shadow-sm">
                        <div className="relative">
                          <img src={item.previewUrl} alt={`Upload ${index + 1}`} className="w-full h-28 object-cover rounded-lg border border-[var(--border-subtle)]"/>
                          <button type="button" onClick={() => handleRemoveSelectedPhoto(item.id)} className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full shadow hover:bg-red-700 transition-colors cursor-pointer" title="Remove photo">
                            <X className="w-3.5 h-3.5"/>
                          </button>
                          <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                            #{index + 1}
                          </span>
                        </div>

                        <input type="text" value={item.caption} onChange={e => handleUpdateCaption(item.id, e.target.value)} placeholder="Caption (Optional)" className="w-full px-2 py-1 text-[10px] rounded-md border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--gold-primary)]"/>
                      </div>))}
                  </div>
                </div>)}

              <div className="p-3 rounded-xl bg-[var(--bg-accent)] text-[11px] text-[var(--text-muted)] leading-snug">
                ⚠️ Enforced DB Policy: Maximum 10 photos per member. You currently have {userPhotoCount} photo(s) in the family gallery.
              </div>

              <button type="submit" disabled={uploading || selectedPhotos.length === 0} className="w-full py-3 rounded-xl bg-gold-gradient text-white font-medium text-xs shadow-md hover:opacity-95 transition-all cursor-pointer shrink-0">
                {uploading
                ? `Publishing ${selectedPhotos.length} Photo(s)...`
                : selectedPhotos.length > 0
                    ? `Publish ${selectedPhotos.length} Photo(s) to Family Gallery`
                    : 'Select Photos Above to Upload'}
              </button>
            </form>
          </div>
        </div>)}

      {/* FULL SCREEN LIGHTBOX & COMMENTS MODAL */}
      {activePhoto && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-[var(--bg-card)] border border-[var(--border-gold)] rounded-2xl overflow-hidden shadow-2xl my-6 grid grid-cols-1 md:grid-cols-2">
            <button onClick={() => setActivePhoto(null)} className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black cursor-pointer">
              <X className="w-5 h-5"/>
            </button>

            {/* Left: Image View */}
            <div className="bg-black flex items-center justify-center p-4 min-h-[300px] md:min-h-[500px]">
              <img src={activePhoto.photo_url} alt={activePhoto.caption || 'Full view'} className="max-h-[70vh] w-auto object-contain rounded-xl"/>
            </div>

            {/* Right: Comments & Details */}
            <div className="p-6 flex flex-col justify-between space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-3">
                <div className="border-b border-[var(--border-subtle)] pb-3">
                  <h4 className="font-serif font-bold text-lg text-[var(--text-primary)]">
                    {activePhoto.caption || 'Family Memory'}
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Uploaded by {activePhoto.user_full_name || 'Family Member'}
                  </p>
                </div>

                {/* Comments Thread */}
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Comments ({activePhoto.comments?.length || 0})
                  </p>
                  {!activePhoto.comments || activePhoto.comments.length === 0 ? (<p className="text-xs text-[var(--text-muted)] italic">No comments yet. Write the first one!</p>) : (activePhoto.comments.map(c => (<div key={c.id} className="p-2.5 rounded-xl bg-[var(--bg-accent)] text-xs space-y-1">
                        <span className="font-bold text-[var(--text-primary)]">{c.user_name || 'Member'}: </span>
                        <span className="text-[var(--text-secondary)]">{c.comment}</span>
                      </div>)))}
                </div>
              </div>

              {/* Comment Input */}
              <form onSubmit={handleSendComment} className="flex gap-2 pt-3 border-t border-[var(--border-subtle)]">
                <input type="text" required value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Write a warm comment..." className="flex-1 px-3 py-2 rounded-xl border border-[var(--border-gold)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] focus:outline-none"/>
                <button type="submit" className="p-2.5 rounded-xl bg-gold-gradient text-white hover:opacity-95 transition-all cursor-pointer">
                  <Send className="w-4 h-4"/>
                </button>
              </form>
            </div>
          </div>
        </div>)}
    </div>);
};
