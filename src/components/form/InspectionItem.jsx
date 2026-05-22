import { useState } from 'react';
import { compressImage } from '../../utils/imageCompressor';

export const InspectionItem = ({ item, value, onChange }) => {
  // Types: radio_status, radio_sim, toggle_basic, toggle_lr
  const { id, label, type, okLabel = 'Sesuai', failLabel = 'Tidak Sesuai' } = item;
  const [isCompressing, setIsCompressing] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const requiresPhotoOnIssue = id.startsWith('ADM-') || id.startsWith('TU-') || id.startsWith('TP-C-');
  const isOkState = value?.kondisi && ['ada_berlaku', 'ok', 'ada', 'baik'].includes(value.kondisi);
  const isFilled = !!value?.kondisi;
  const isDefective = isFilled && !isOkState;

  const handleChange = (newKondisi, newDetail = null) => {
    const isOkStates = ['ada_berlaku', 'ok', 'ada', 'baik'];
    const isOk = isOkStates.includes(newKondisi);
    // If the new state is OK, clear the photo!
    const newFoto = isOk ? null : value?.foto;
    onChange(id, { kondisi: newKondisi, detail: newDetail || value?.detail, foto: newFoto });
  };

  const handleDetailChange = (side, isOk) => {
    const currentDetail = value?.detail || { kanan: true, kiri: true };
    const newDetail = { ...currentDetail, [side]: isOk };
    
    // If both are true, overall kondisi is 'ok', else 'gagal'
    const newKondisi = (newDetail.kanan && newDetail.kiri) ? 'ok' : 'gagal';
    const isOkStates = ['ada_berlaku', 'ok', 'ada', 'baik'];
    const isOkResult = isOkStates.includes(newKondisi);
    const newFoto = isOkResult ? null : value?.foto;
    
    onChange(id, { kondisi: newKondisi, detail: newDetail, foto: newFoto });
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsCompressing(true);
    setUploadError('');
    try {
      const compressedBase64 = await compressImage(file);
      onChange(id, { ...value, foto: compressedBase64 });
    } catch (err) {
      console.error('Error compressing photo:', err);
      setUploadError('Gagal mengompres dan mengunggah gambar.');
    } finally {
      setIsCompressing(false);
    }
  };

  const removePhoto = () => {
    onChange(id, { ...value, foto: null });
    setUploadError('');
  };

  const getPhotoLabel = () => {
    if (type === 'toggle_lr' && value?.detail) {
      const { kanan, kiri } = value.detail;
      if (!kanan && !kiri) {
        return `Foto Bukti Kerusakan ${label} (Sisi Kanan & Kiri) (Wajib)`;
      } else if (!kanan) {
        return `Foto Bukti Kerusakan ${label} (Sisi Kanan) (Wajib)`;
      } else if (!kiri) {
        return `Foto Bukti Kerusakan ${label} (Sisi Kiri) (Wajib)`;
      }
    }
    return `Foto Bukti Kerusakan ${label} (Wajib)`;
  };

  const renderPhotoUpload = () => {
    if (!requiresPhotoOnIssue || !isDefective) return null;

    return (
      <div className="mt-4 p-4 bg-red-50/60 border border-dashed border-red-200 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
        <span className="text-xs text-red-700 font-bold mb-2 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px] text-red-600">photo_camera</span>
          {getPhotoLabel()}
        </span>
        
        {value?.foto ? (
          <div className="relative w-full max-w-[240px] aspect-video sm:aspect-square rounded-xl border border-red-200 overflow-hidden bg-neutral-100 group shadow-sm">
            <img src={value.foto} alt={`Bukti ${label}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button 
                type="button"
                onClick={removePhoto}
                className="bg-white text-status-danger p-2.5 rounded-full shadow-md hover:scale-110 active:scale-95 transition-transform flex items-center justify-center btn-press"
                title="Hapus foto"
              >
                <span className="material-symbols-outlined text-[20px]">delete</span>
              </button>
            </div>
          </div>
        ) : (
          <div>
            <label className={`flex items-center justify-center gap-2 h-12 rounded-xl border border-dashed border-red-300 bg-white hover:bg-red-50 hover:border-red-400 transition-all cursor-pointer text-red-600 active:scale-[0.98] ${isCompressing ? 'opacity-70 pointer-events-none' : ''}`}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handlePhotoUpload} 
                className="hidden" 
                disabled={isCompressing}
              />
              {isCompressing ? (
                <>
                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-semibold">Mengompres & Mengunggah...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">add_a_photo</span>
                  <span className="text-xs font-semibold">Ambil / Unggah Foto Bukti</span>
                </>
              )}
            </label>
            <p className="text-[10px] text-neutral-mid mt-1.5 leading-relaxed">
              *Harap sertakan foto bagian yang bermasalah. Gambar akan otomatis dioptimalkan agar ringan dan hemat kuota internet.
            </p>
          </div>
        )}

        {uploadError && (
          <p className="text-[10px] text-status-danger font-semibold mt-1">{uploadError}</p>
        )}
      </div>
    );
  };

  const renderRadioStatus = () => (
    <div className="flex flex-col gap-3.5 sm:flex-row sm:gap-3 mt-4">
      <label className={`flex-1 py-4 flex items-center px-4 border rounded-xl cursor-pointer transition-all duration-200 btn-press active:scale-[0.98] ${value?.kondisi === 'ada_berlaku' ? 'bg-green-50 border-status-success text-status-success font-semibold shadow-[0_2px_8px_rgba(22,163,74,0.06)]' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50/50 hover:border-slate-300 hover:shadow-sm'}`}>
        <input type="radio" name={id} value="ada_berlaku" checked={value?.kondisi === 'ada_berlaku'} onChange={() => handleChange('ada_berlaku')} className="hidden" />
        <span className="material-symbols-outlined text-[18px] mr-2.5 transition-transform duration-200" style={{ fontVariationSettings: value?.kondisi === 'ada_berlaku' ? "'FILL' 1" : "'FILL' 0" }}>
          check_circle
        </span>
        <span className="text-xs sm:text-sm font-semibold">Ada, Berlaku</span>
      </label>
      <label className={`flex-1 py-4 flex items-center px-4 border rounded-xl cursor-pointer transition-all duration-200 btn-press active:scale-[0.98] ${value?.kondisi === 'tidak_berlaku' ? 'bg-red-50 border-status-danger text-status-danger font-semibold shadow-[0_2px_8px_rgba(220,38,38,0.06)]' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50/50 hover:border-slate-300 hover:shadow-sm'}`}>
        <input type="radio" name={id} value="tidak_berlaku" checked={value?.kondisi === 'tidak_berlaku'} onChange={() => handleChange('tidak_berlaku')} className="hidden" />
        <span className="material-symbols-outlined text-[18px] mr-2.5 transition-transform duration-200" style={{ fontVariationSettings: value?.kondisi === 'tidak_berlaku' ? "'FILL' 1" : "'FILL' 0" }}>
          cancel
        </span>
        <span className="text-xs sm:text-sm font-semibold">Tidak Berlaku</span>
      </label>
      <label className={`flex-1 py-4 flex items-center px-4 border rounded-xl cursor-pointer transition-all duration-200 btn-press active:scale-[0.98] ${value?.kondisi === 'tidak_ada' ? 'bg-red-50 border-status-danger text-status-danger font-semibold shadow-[0_2px_8px_rgba(220,38,38,0.06)]' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50/50 hover:border-slate-300 hover:shadow-sm'}`}>
        <input type="radio" name={id} value="tidak_ada" checked={value?.kondisi === 'tidak_ada'} onChange={() => handleChange('tidak_ada')} className="hidden" />
        <span className="material-symbols-outlined text-[18px] mr-2.5 transition-transform duration-200" style={{ fontVariationSettings: value?.kondisi === 'tidak_ada' ? "'FILL' 1" : "'FILL' 0" }}>
          warning
        </span>
        <span className="text-xs sm:text-sm font-semibold">Tidak Ada</span>
      </label>
    </div>
  );

  const renderToggleBasic = () => {
    const isOkActive = value?.kondisi === 'ok' || value?.kondisi === 'ada' || value?.kondisi === 'baik';
    const isFailActive = value?.kondisi === 'gagal' || value?.kondisi === 'tidak_ada' || value?.kondisi === 'buruk' || value?.kondisi === 'kurang_baik';
    
    return (
      <div className="flex flex-col gap-3.5 sm:flex-row sm:gap-3 mt-4">
        <button 
          type="button"
          onClick={() => handleChange('ok')}
          className={`flex-grow flex-1 py-4 flex justify-center items-center px-4 rounded-xl border font-semibold text-xs sm:text-sm transition-all duration-200 btn-press active:scale-[0.98]
            ${isOkActive 
              ? 'bg-green-50 border-status-success text-status-success shadow-[0_2px_8px_rgba(22,163,74,0.06)]' 
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50/50 hover:border-slate-300 hover:shadow-sm'}`}
        >
          <span className="material-symbols-outlined text-[18px] mr-2" style={{ fontVariationSettings: isOkActive ? "'FILL' 1" : "'FILL' 0" }}>
            check_circle
          </span>
          {okLabel}
        </button>
        <button 
          type="button"
          onClick={() => handleChange('gagal')}
          className={`flex-grow flex-1 py-4 flex justify-center items-center px-4 rounded-xl border font-semibold text-xs sm:text-sm transition-all duration-200 btn-press active:scale-[0.98]
            ${isFailActive 
              ? 'bg-red-50 border-status-danger text-status-danger shadow-[0_2px_8px_rgba(220,38,38,0.06)]' 
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50/50 hover:border-slate-300 hover:shadow-sm'}`}
        >
          <span className="material-symbols-outlined text-[18px] mr-2" style={{ fontVariationSettings: isFailActive ? "'FILL' 1" : "'FILL' 0" }}>
            cancel
          </span>
          {failLabel}
        </button>
      </div>
    );
  };

  const renderToggleLR = () => {
    const isOk = value?.kondisi === 'ok';
    const hasValue = !!value?.kondisi;
    const detail = value?.detail || { kanan: true, kiri: true };

    return (
      <div className="mt-4 space-y-3.5">
        <div className="flex flex-col gap-3.5 sm:flex-row sm:gap-3">
          <button 
            type="button"
            onClick={() => { handleChange('ok', { kanan: true, kiri: true }); }}
            className={`flex-grow flex-1 py-4 flex justify-center items-center px-4 rounded-xl border font-semibold text-xs sm:text-sm transition-all duration-200 btn-press active:scale-[0.98]
              ${isOk 
                ? 'bg-green-50 border-status-success text-status-success shadow-[0_2px_8px_rgba(22,163,74,0.06)]' 
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50/50 hover:border-slate-300 hover:shadow-sm'}`}
          >
            <span className="material-symbols-outlined text-[18px] mr-2" style={{ fontVariationSettings: isOk ? "'FILL' 1" : "'FILL' 0" }}>
              check_circle
            </span>
            Semua Menyala/Sesuai
          </button>
          <button 
            type="button"
            onClick={() => { handleChange('gagal', { kanan: false, kiri: false }); }}
            className={`flex-grow flex-1 py-4 flex justify-center items-center px-4 rounded-xl border font-semibold text-xs sm:text-sm transition-all duration-200 btn-press active:scale-[0.98]
              ${(!isOk && hasValue) 
                ? 'bg-red-50 border-status-danger text-status-danger shadow-[0_2px_8px_rgba(220,38,38,0.06)]' 
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50/50 hover:border-slate-300 hover:shadow-sm'}`}
          >
            <span className="material-symbols-outlined text-[18px] mr-2" style={{ fontVariationSettings: (!isOk && hasValue) ? "'FILL' 1" : "'FILL' 0" }}>
              cancel
            </span>
            Ada Rusak
          </button>
        </div>

        {/* Detil Kanan / Kiri muncul jika ada yang rusak */}
        {!isOk && hasValue && (
          <div className="flex flex-col gap-3.5 p-4 bg-red-50/50 border border-red-100 rounded-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex-1">
              <span className="text-[11px] text-red-800 font-bold mb-1.5 block uppercase tracking-wider">Sisi Kanan</span>
              <div className="flex h-11 bg-white rounded-xl border border-red-200 overflow-hidden shadow-sm">
                <button 
                  type="button"
                  onClick={() => handleDetailChange('kanan', true)}
                  className={`flex-1 flex items-center justify-center text-xs font-bold transition-all duration-200 active:scale-[0.95] ${detail.kanan ? 'bg-status-success text-white shadow-inner font-extrabold' : 'text-neutral-500 hover:bg-neutral-50'}`}
                >OK</button>
                <div className="w-px bg-red-200"></div>
                <button 
                  type="button"
                  onClick={() => handleDetailChange('kanan', false)}
                  className={`flex-1 flex items-center justify-center text-xs font-bold transition-all duration-200 active:scale-[0.95] ${!detail.kanan ? 'bg-status-danger text-white shadow-inner font-extrabold' : 'text-neutral-500 hover:bg-neutral-50'}`}
                >Rusak</button>
              </div>
            </div>
            <div className="flex-1">
              <span className="text-[11px] text-red-800 font-bold mb-1.5 block uppercase tracking-wider">Sisi Kiri</span>
              <div className="flex h-11 bg-white rounded-xl border border-red-200 overflow-hidden shadow-sm">
                <button 
                  type="button"
                  onClick={() => handleDetailChange('kiri', true)}
                  className={`flex-1 flex items-center justify-center text-xs font-bold transition-all duration-200 active:scale-[0.95] ${detail.kiri ? 'bg-status-success text-white shadow-inner font-extrabold' : 'text-neutral-500 hover:bg-neutral-50'}`}
                >OK</button>
                <div className="w-px bg-red-200"></div>
                <button 
                  type="button"
                  onClick={() => handleDetailChange('kiri', false)}
                  className={`flex-1 flex items-center justify-center text-xs font-bold transition-all duration-200 active:scale-[0.95] ${!detail.kiri ? 'bg-status-danger text-white shadow-inner font-extrabold' : 'text-neutral-500 hover:bg-neutral-50'}`}
                >Rusak</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="py-6 px-5 sm:p-6 bg-slate-50/30 border border-slate-100 rounded-2xl transition-all duration-200 shadow-sm hover:bg-white hover:border-slate-200 hover:shadow-md animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100/80 mb-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] bg-neutral-100 text-neutral-mid px-2 py-0.5 rounded font-extrabold uppercase tracking-wide border border-neutral-200 shrink-0">
            {id}
          </span>
          <label className="text-sm sm:text-[15px] font-semibold text-slate-800 leading-snug">{label}</label>
        </div>
        {isDefective ? (
          <span className="text-[10px] font-bold text-status-danger bg-red-50 px-2 py-0.5 rounded-full border border-red-200 flex items-center gap-1 animate-pulse shrink-0 w-fit">
            <span className="w-1.5 h-1.5 bg-status-danger rounded-full"></span>
            Bermasalah
          </span>
        ) : isOkState ? (
          <span className="text-[10px] font-bold text-status-success bg-green-50 px-2 py-0.5 rounded-full border border-green-200 flex items-center gap-1 shrink-0 w-fit">
            <span className="w-1.5 h-1.5 bg-status-success rounded-full"></span>
            Sesuai / OK
          </span>
        ) : null}
      </div>
      
      {type === 'radio_status' && renderRadioStatus()}
      {type === 'radio_sim' && renderRadioStatus()}
      {type === 'toggle_basic' && renderToggleBasic()}
      {type === 'toggle_lr' && renderToggleLR()}

      {renderPhotoUpload()}
    </div>
  );
};
