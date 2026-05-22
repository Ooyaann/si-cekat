import { useState } from 'react';
import { InspeksiProvider, useInspeksi } from '../../context/InspeksiContext';
import { StepIndicator } from '../../components/form/StepIndicator';
import { useNavigate } from 'react-router-dom';
import { formItems } from '../../data/formItems';
import { calculateScore } from '../../utils/scoring';
import { useDialog } from '../../context/DialogContext';

import { FormDataKendaraan } from '../../components/form/FormDataKendaraan';
import { FormAdministrasi } from '../../components/form/FormAdministrasi';
import { FormTeknisUtama } from '../../components/form/FormTeknisUtama';
import { FormTeknisPenunjang } from '../../components/form/FormTeknisPenunjang';
import { FormDokumentasi } from '../../components/form/FormDokumentasi';
import { FormReview } from '../../components/form/FormReview';

const WizardContainer = () => {
  const { currentStep, nextStep, prevStep, formData } = useInspeksi();
  const navigate = useNavigate();
  const { showConfirm } = useDialog();
  const [shouldShake, setShouldShake] = useState(false);

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <FormDataKendaraan />;
      case 2: return <FormAdministrasi />;
      case 3: return <FormTeknisUtama />;
      case 4: return <FormTeknisPenunjang />;
      case 5: return <FormDokumentasi />;
      case 6: return <FormReview />;
      default: return <FormDataKendaraan />;
    }
  };

  // Step validation check
  const getStepValidationState = () => {
    switch (currentStep) {
      case 1:
        if (!formData.kendaraanId || !formData.lokasiNama?.trim()) {
          return { isValid: false, message: 'Harap pilih kendaraan dan isi nama lokasi' };
        }
        return { isValid: true };
      case 2: {
        const uncompletedI = formItems.seksiI.filter(
          item => !formData.seksiI || formData.seksiI[item.id]?.kondisi === undefined
        );
        if (uncompletedI.length > 0) {
          return { isValid: false, message: `Harap isi semua dokumen administrasi (Sisa ${uncompletedI.length})` };
        }

        // Check if any defective document is missing its photo upload
        const isOkStates = ['ada_berlaku', 'ok', 'ada', 'baik'];
        const defectiveWithoutPhotoI = formItems.seksiI.filter(item => {
          const val = formData.seksiI?.[item.id];
          if (!val) return false;
          const isDefective = !isOkStates.includes(val.kondisi);
          return isDefective && !val.foto;
        });

        if (defectiveWithoutPhotoI.length > 0) {
          return { 
            isValid: false, 
            message: `Harap unggah foto bukti untuk dokumen bermasalah: ${defectiveWithoutPhotoI.map(i => i.label).join(', ')}` 
          };
        }
        return { isValid: true };
      }
      case 3: {
        let uncompletedII = [];
        let defectiveWithoutPhotoII = [];
        const isOkStates = ['ada_berlaku', 'ok', 'ada', 'baik'];

        Object.values(formItems.seksiII).forEach(cat => {
          cat.items.forEach(item => {
            const val = formData.seksiII?.[item.id];
            if (!val || val.kondisi === undefined) {
              uncompletedII.push(item.label);
            } else {
              const isDefective = !isOkStates.includes(val.kondisi);
              if (isDefective && !val.foto) {
                defectiveWithoutPhotoII.push(item.label);
              }
            }
          });
        });

        if (uncompletedII.length > 0) {
          return { isValid: false, message: `Harap isi seluruh pemeriksaan teknis utama (Sisa ${uncompletedII.length})` };
        }
        if (defectiveWithoutPhotoII.length > 0) {
          return { 
            isValid: false, 
            message: `Harap unggah foto bukti kerusakan untuk: ${defectiveWithoutPhotoII.join(', ')}` 
          };
        }
        return { isValid: true };
      }
      case 4: {
        let uncompletedIII = [];
        let defectiveWithoutPhotoIII = [];
        const isOkStates = ['ada_berlaku', 'ok', 'ada', 'baik'];

        Object.values(formItems.seksiIII).forEach(cat => {
          cat.items.forEach(item => {
            const val = formData.seksiIII?.[item.id];
            if (!val || val.kondisi === undefined) {
              uncompletedIII.push(item.label);
            } else {
              const isDefective = !isOkStates.includes(val.kondisi);
              const requiresPhoto = item.id.startsWith('TP-C-');
              if (isDefective && requiresPhoto && !val.foto) {
                defectiveWithoutPhotoIII.push(item.label);
              }
            }
          });
        });

        if (uncompletedIII.length > 0) {
          return { isValid: false, message: `Harap isi seluruh pemeriksaan teknis penunjang (Sisa ${uncompletedIII.length})` };
        }
        if (defectiveWithoutPhotoIII.length > 0) {
          return { 
            isValid: false, 
            message: `Harap unggah foto bukti kerusakan untuk: ${defectiveWithoutPhotoIII.join(', ')}` 
          };
        }
        return { isValid: true };
      }
      case 5:
        if (!formData.tandaTangan) {
          return { isValid: false, message: 'Tanda tangan digital wajib diisi' };
        }
        if (!formData.fotoUmum || formData.fotoUmum.length < 2) {
          return { isValid: false, message: `Harap unggah minimal 2 foto bus (Aktif: ${formData.fotoUmum?.length || 0})` };
        }
        return { isValid: true };
      case 6:
        return { isValid: true };
      default:
        return { isValid: false, message: 'Error validasi' };
    }
  };

  const { isValid, message } = getStepValidationState();

  // Real-time score & status calculation
  const getRealtimeStatus = () => {
    if (currentStep < 2) return null;
    const scoreResult = calculateScore(formData);
    return scoreResult;
  };

  const currentResult = getRealtimeStatus();

  const handleNextStep = () => {
    if (!isValid) {
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 500);
      return;
    }
    nextStep();
  };

  return (
    <div className="pb-56 sm:pb-36 select-none min-h-screen bg-page-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[10px] font-bold text-neutral-mid uppercase tracking-wider">Langkah {currentStep} dari 6</span>
            <h1 className="text-xl font-display font-extrabold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-[24px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>directions_bus</span>
              Form Ramp Check
            </h1>
          </div>
          <button 
            type="button"
            onClick={() => {
              showConfirm({
                title: 'Batalkan Pengisian?',
                message: 'Apakah Anda yakin ingin membatalkan pengisian ramp check? Draf yang belum disubmit akan tetap disimpan secara lokal.',
                confirmText: 'Ya, Batal',
                cancelText: 'Lanjutkan',
                onConfirm: () => {
                  navigate('/supir/dashboard');
                }
              });
            }}
            className="text-xs font-bold text-neutral-mid hover:text-neutral-dark bg-white border border-neutral-200 px-3.5 py-2 rounded-lg shadow-sm transition-all duration-150 active:scale-95 btn-press"
          >
            Batal
          </button>
        </div>

        {/* StepIndicator */}
        <StepIndicator currentStep={currentStep} totalSteps={6} />

        {/* Step Content */}
        <div className="mt-6">
          {renderStep()}
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-neutral-light p-4 pb-safe z-40 shadow-[0px_-4px_12px_rgba(30,41,59,0.05)] animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col gap-3">
          
          {/* Validation alert / help text & Real-time kelayakan status */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-neutral-light pb-2 text-xs">
            <div className={`flex-1 transition-all duration-300 ${shouldShake ? 'animate-shake' : ''}`}>
              {!isValid ? (
                <span className="text-status-danger font-bold flex items-center gap-1.5 bg-status-danger/10 border border-status-danger/20 px-3 py-1.5 rounded-lg w-fit transition-all duration-300 animate-in fade-in slide-in-from-left-2">
                  <span className="material-symbols-outlined text-[16px] text-status-danger" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
                  <span>{message}</span>
                </span>
              ) : (
                <span className="text-status-success font-bold flex items-center gap-1.5 bg-status-success/10 border border-status-success/20 px-3 py-1.5 rounded-lg w-fit transition-all duration-300 animate-in fade-in slide-in-from-left-2">
                  <span className="material-symbols-outlined text-[16px] text-status-success" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <span>Seluruh data langkah ini sudah terisi lengkap</span>
                </span>
              )}
            </div>

            {currentResult && (
              <div className="flex items-center gap-2 shrink-0 bg-neutral-light/50 border border-neutral-light rounded-lg px-3 py-1.5 transition-all duration-300 animate-in fade-in slide-in-from-right-2">
                <span className="text-neutral-mid font-semibold">Estimasi Hasil:</span>
                {currentResult.statusFinal === 'LAYAK' && (
                  <span className="px-2.5 py-0.5 rounded-md bg-status-success/15 border border-status-success/30 text-status-success font-extrabold uppercase tracking-wider text-[9px] shadow-sm transition-all duration-200">
                    LAYAK JALAN ({currentResult.skorPersen}%)
                  </span>
                )}
                {currentResult.statusFinal === 'PERINGATAN' && (
                  <span className="px-2.5 py-0.5 rounded-md bg-status-warning/15 border border-status-warning/30 text-status-warning font-extrabold uppercase tracking-wider text-[9px] shadow-sm transition-all duration-200">
                    PERINGATAN ({currentResult.skorPersen}%)
                  </span>
                )}
                {currentResult.statusFinal === 'TIDAK_LAYAK' && (
                  <span className="px-2.5 py-0.5 rounded-md bg-status-danger/15 border border-status-danger/30 text-status-danger font-extrabold uppercase tracking-wider text-[9px] shadow-sm transition-all duration-200">
                    TIDAK LAYAK ({currentResult.skorPersen}%)
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`h-11 px-6 font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 btn-press
                ${currentStep === 1 
                  ? 'text-neutral-400 bg-neutral-100 cursor-not-allowed border border-neutral-200 shadow-none' 
                  : 'text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-50 active:scale-95 shadow-sm'
                }`}
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Kembali</span>
            </button>
            
            {currentStep < 6 && (
              <button
                type="button"
                onClick={handleNextStep}
                className={`h-11 px-8 font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-all duration-200 flex items-center gap-1.5 active:scale-95 btn-press
                  ${isValid 
                    ? 'bg-primary text-white hover:bg-opacity-95' 
                    : 'bg-neutral-light border border-neutral-light text-neutral-mid hover:bg-neutral-light/75 cursor-pointer'
                  }`}
              >
                <span>Lanjut</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
          


const InspeksiBaru = () => {
  return (
    <InspeksiProvider>
      <WizardContainer />
    </InspeksiProvider>
  );
};

export default InspeksiBaru;
