import { useInspeksi } from '../../context/InspeksiContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../common/Card';
import { SignatureCanvas } from './SignatureCanvas';
import { useState } from 'react';
import { compressImage } from '../../utils/imageCompressor';

export const FormDokumentasi = () => {
  const { formData, updateFormData } = useInspeksi();
  const { user } = useAuth();
  const [photoError, setPhotoError] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setPhotoError('');
    setIsCompressing(true);
    
    try {
      // Process each file to compressed Base64
      const promises = files.map(file => compressImage(file));
      const base64Images = await Promise.all(promises);
      const currentPhotos = formData.fotoUmum || [];
      const newPhotos = [...currentPhotos, ...base64Images];
      updateFormData('fotoUmum', newPhotos);
    } catch (err) {
      console.error("Error uploading photo:", err);
      setPhotoError('Gagal mengompres dan mengunggah foto. Silakan coba file lain.');
    } finally {
      setIsCompressing(false);
    }
  };

  const removePhoto = (indexToRemove) => {
    const currentPhotos = formData.fotoUmum || [];
    const newPhotos = currentPhotos.filter((_, idx) => idx !== indexToRemove);
    updateFormData('fotoUmum', newPhotos);
  };

  const photos = formData.fotoUmum || [];

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Section: Foto Dokumentasi */}
      <Card>
        <div className="mb-4 pb-2 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-primary-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-neutral-mid">photo_camera</span>
            Foto Kondisi Umum
          </h2>
          <span className="font-mono text-xs text-neutral-mid">Min. 2 Foto</span>
        </div>

        {photoError && (
          <div className="mb-3 p-3 bg-red-50 text-red-700 text-xs rounded border border-red-200">
            {photoError}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* List of uploaded photos */}
          {photos.map((photoUrl, idx) => (
            <div key={idx} className="relative aspect-square rounded-lg border border-neutral-200 overflow-hidden group bg-neutral-100 shadow-sm">
              <img src={photoUrl} alt={`Kondisi Umum ${idx + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  type="button"
                  onClick={() => removePhoto(idx)}
                  className="bg-white text-status-danger p-2 rounded-full shadow-sm hover:scale-105 transition-transform flex items-center justify-center"
                  title="Hapus foto"
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </div>
            </div>
          ))}

          {/* Upload Button */}
          <label className={`aspect-square rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 hover:bg-neutral-100 hover:border-primary transition-colors flex flex-col items-center justify-center gap-2 text-neutral-mid cursor-pointer min-h-[44px] ${isCompressing ? 'opacity-70 pointer-events-none' : ''}`}>
            <input 
              type="file" 
              accept="image/*" 
              multiple 
              onChange={handlePhotoUpload} 
              className="hidden" 
              disabled={isCompressing}
            />
            {isCompressing ? (
              <>
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Mengompres...</span>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">add_a_photo</span>
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider">Tambah Foto</span>
              </>
            )}
          </label>
        </div>
        {photos.length < 2 && (
          <p className="text-xs text-amber-600 mt-2 font-medium">ℹ️ Mohon unggah minimal 2 foto kondisi bus (depan, belakang, atau sisi samping).</p>
        )}
      </Card>

      {/* Section: Tanda Tangan */}
      <Card>
        <div className="mb-4 pb-2 border-b">
          <h2 className="text-lg font-semibold text-primary-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-neutral-mid">draw</span>
            Tanda Tangan Pengemudi
          </h2>
          <p className="text-sm text-neutral-500 mt-1">Tanda tangan digital Anda sebagai pernyataan kebenaran pengisian form.</p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-x-6 gap-y-2 bg-neutral-100 p-3 rounded-lg border border-neutral-200 font-mono text-xs text-neutral-dark">
            <div><span className="text-neutral-mid">Nama:</span> {user?.nama || 'Budi Santoso'}</div>
            <div><span className="text-neutral-mid">ID Supir:</span> {user?.id || 'DRV-8821'}</div>
          </div>

          <SignatureCanvas 
            initialData={formData.tandaTangan}
            onSave={(data) => updateFormData('tandaTangan', data)} 
          />
          {!formData.tandaTangan && (
            <p className="text-xs text-red-500 mt-1 font-medium">⚠️ Tanda tangan wajib diisi.</p>
          )}
        </div>
      </Card>

      {/* Section: Catatan Tambahan */}
      <Card>
        <div className="mb-4 pb-2 border-b flex items-center gap-2 text-primary-900">
          <span className="material-symbols-outlined">edit_note</span>
          <h2 className="text-lg font-semibold">Catatan Tambahan</h2>
        </div>
        <textarea
          className="w-full rounded-lg border border-neutral-300 bg-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 font-body text-sm p-3 min-h-[100px]"
          placeholder="Masukkan catatan atau temuan tambahan jika ada..."
          value={formData.catatan || ''}
          onChange={(e) => updateFormData('catatan', e.target.value)}
        />
      </Card>
    </div>
  );
};
