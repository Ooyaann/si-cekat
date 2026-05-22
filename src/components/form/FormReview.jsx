/* eslint-disable react-hooks/purity */
import { useInspeksi } from '../../context/InspeksiContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { calculateScore } from '../../utils/scoring';
import { useNavigate } from 'react-router-dom';

export const FormReview = () => {
  const { formData, resetForm } = useInspeksi();
  const { user } = useAuth();
  const { kendaraanList, addInspeksi } = useData();
  const navigate = useNavigate();

  const selectedKendaraan = kendaraanList.find(k => k.id === formData.kendaraanId);
  const hasil = calculateScore(formData);

  const handleSubmit = async () => {
    // Generate unique ID
    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const inspeksiId = `INS-${dateStr}-${randomNum}`;
    const rcNum = `RC-${dateStr}-${randomNum}`;

    const waktuMulai = new Date(formData.waktuMulai);
    const waktuSubmit = new Date();
    const durasiDetik = Math.floor((waktuSubmit.getTime() - waktuMulai.getTime()) / 1000);

    const finalData = {
      id: inspeksiId,
      nomorRampCheck: rcNum,
      supirId: user.id,
      kendaraanId: formData.kendaraanId,
      tanggal: formData.tanggal,
      waktuMulai: formData.waktuMulai,
      waktuSubmit: waktuSubmit.toISOString(),
      durasiDetik,
      lokasi: { tipe: formData.lokasiTipe, nama: formData.lokasiNama },
      jenisTrayek: selectedKendaraan?.jenisAngkutan,
      trayek: selectedKendaraan?.trayek,
      seksiI: formData.seksiI,
      seksiII: formData.seksiII,
      seksiIII: formData.seksiIII,
      catatan: formData.catatan,
      tandaTangan: formData.tandaTangan,
      fotoUmum: formData.fotoUmum,
      hasil
    };

    // Save to context/localStorage
    addInspeksi(finalData);
    
    // Reset form draft
    resetForm();

    // Redirect to detail page
    navigate(`/supir/inspeksi/${inspeksiId}`, { replace: true });
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <Card>
        <div className="mb-4 pb-2 border-b">
          <h2 className="text-lg font-semibold text-primary-900">Review & Kirim</h2>
          <p className="text-sm text-neutral-500">Periksa kembali data sebelum mengirim.</p>
        </div>

        <div className="space-y-6">
          {/* Prediksi Status */}
          <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
            <h3 className="font-medium text-sm text-neutral-500 mb-2">Prediksi Hasil</h3>
            <div className="flex justify-between items-center mb-2">
              <Badge 
                status={hasil.statusFinal === 'LAYAK' ? 'success' : (hasil.statusFinal === 'PERINGATAN' ? 'warning' : 'danger')} 
                text={hasil.statusFinal} 
              />
              <span className="font-bold text-lg">{hasil.skorPersen}%</span>
            </div>
            {hasil.statusFinal !== 'LAYAK' && (
              <p className="text-xs text-red-600 mt-2">
                Ditemukan {hasil.itemBermasalah.length} item bermasalah.
              </p>
            )}
          </div>

          {/* Temuan Masalah & Foto Bukti */}
          {hasil.itemBermasalah.length > 0 && (
            <div className="bg-red-50/50 p-4 rounded-xl border border-red-200 mt-2">
              <h4 className="font-semibold text-xs text-red-800 mb-3 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-red-600">warning</span>
                Daftar Temuan Masalah ({hasil.itemBermasalah.length})
              </h4>
              <div className="space-y-3">
                {hasil.itemBermasalah.map((item, idx) => {
                  const getPhotoForItem = (item) => {
                    if (item.seksi === 'I') return formData.seksiI?.[item.kode]?.foto;
                    if (item.seksi === 'II') return formData.seksiII?.[item.kode]?.foto;
                    if (item.seksi === 'III') return formData.seksiIII?.[item.kode]?.foto;
                    return null;
                  };
                  const foto = getPhotoForItem(item);
                  return (
                    <div key={idx} className="flex gap-3 bg-white p-3 rounded-lg border border-red-100 shadow-sm text-xs">
                      {foto && (
                        <div className="w-14 h-14 rounded-lg border border-red-200 overflow-hidden shrink-0 bg-neutral-100">
                          <img src={foto} alt={item.label} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[9px] text-neutral-mid font-semibold">{item.kode}</span>
                          <span className="px-1.5 py-0.2 bg-red-100 text-red-700 rounded text-[8px] font-bold uppercase tracking-wide">
                            Seksi {item.seksi}
                          </span>
                        </div>
                        <span className="font-bold text-neutral-800 text-xs mt-1">{item.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
            <div>
              <span className="text-neutral-500 block text-xs">Tanggal</span>
              <span className="font-medium">{formData.tanggal}</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-xs">Lokasi</span>
              <span className="font-medium">{formData.lokasiTipe} - {formData.lokasiNama}</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-xs">Kendaraan</span>
              <span className="font-medium">{selectedKendaraan?.nomorPolisi || '-'}</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-xs">Tanda Tangan</span>
              <span className="font-medium text-green-600 flex items-center">
                {formData.tandaTangan ? '✓ Tersimpan' : '✗ Belum ada'}
              </span>
            </div>
          </div>
          
          {!formData.tandaTangan && (
             <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
               Anda harus kembali ke langkah sebelumnya untuk mengisi Tanda Tangan.
             </div>
          )}
        </div>
      </Card>

      {/* Trik: We don't render the submit button here directly if it's handled by WizardContainer, 
          but WizardContainer needs to know to call handleSubmit. 
          Actually, since WizardContainer renders the button, we should expose the submit logic.
          Let's attach the submit logic to a global or context function, or just render the button here. 
          To fix: we'll render a specific button here and hide the WizardContainer's "Lanjut" button, 
          OR we can modify WizardContainer. 
          For simplicity, we render a massive submit button here and tell user to click it. */}
          
      <div className="pt-4 pb-8">
        <button
          onClick={handleSubmit}
          disabled={!formData.tandaTangan}
          className={`w-full py-3 rounded-lg font-bold text-white shadow-md transition-colors 
            ${formData.tandaTangan ? 'bg-primary-600 hover:bg-primary-700' : 'bg-neutral-400 cursor-not-allowed'}`}
        >
          Kirim Hasil Inspeksi
        </button>
        <p className="text-xs text-center text-neutral-500 mt-3">
          Data yang sudah dikirim tidak dapat diubah kembali.
        </p>
      </div>
    </div>
  );
};
