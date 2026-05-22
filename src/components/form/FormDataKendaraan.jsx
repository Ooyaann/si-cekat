import { useInspeksi } from '../../context/InspeksiContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card } from '../common/Card';
import { CustomSelect } from '../common/CustomSelect';
import { useEffect } from 'react';

export const FormDataKendaraan = () => {
  const { formData, updateFormData } = useInspeksi();
  const { user } = useAuth();
  const { kendaraanList } = useData();

  // Initialize with user's active vehicle if not set
  useEffect(() => {
    if (!formData.kendaraanId && user?.kendaraanAktif) {
      updateFormData('kendaraanId', user.kendaraanAktif);
    }
  }, [formData.kendaraanId, user, updateFormData]);

  const selectedKendaraan = kendaraanList.find(k => k.id === formData.kendaraanId);

  const handleKendaraanChange = (e) => {
    updateFormData('kendaraanId', e.target.value);
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <Card>
        <h2 className="text-lg font-semibold mb-4 text-primary-900 border-b pb-2">Informasi Umum</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Tanggal Inspeksi</label>
            <input 
              type="date" 
              className="w-full rounded-md border border-neutral-300 p-2 bg-neutral-50 cursor-not-allowed text-sm"
              value={formData.tanggal}
              readOnly
              disabled
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Tipe Lokasi</label>
              <CustomSelect 
                value={formData.lokasiTipe}
                onChange={(e) => updateFormData('lokasiTipe', e.target.value)}
                options={[
                  { value: 'Terminal', label: 'Terminal' },
                  { value: 'Pool', label: 'Pool' },
                  { value: 'Lainnya', label: 'Lainnya' }
                ]}
                placeholder="Pilih tipe lokasi"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Nama Lokasi</label>
              <input 
                type="text" 
                className="w-full h-11 px-3 rounded-xl border border-neutral-300 focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm font-semibold outline-none transition-all placeholder:text-neutral-400"
                placeholder="Contoh: Pulogadung"
                value={formData.lokasiNama}
                onChange={(e) => updateFormData('lokasiNama', e.target.value)}
                required
              />
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-4 text-primary-900 border-b pb-2">Data Kendaraan</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Pilih Kendaraan (Nomor Polisi)</label>
            <CustomSelect 
              value={formData.kendaraanId}
              onChange={handleKendaraanChange}
              options={kendaraanList.map(k => ({ value: k.id, label: `${k.nomorPolisi} - ${k.merk}` }))}
              placeholder="-- Pilih Kendaraan --"
              required
            />
          </div>

          {selectedKendaraan && (
            <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-neutral-500">Nomor Uji / STUK</label>
                <div className="font-medium">{selectedKendaraan.nomorSTUK || '-'}</div>
              </div>
              <div>
                <label className="block text-xs text-neutral-500">Nama Perusahaan (PO)</label>
                <div className="font-medium">{selectedKendaraan.namaPO || '-'}</div>
              </div>
              <div>
                <label className="block text-xs text-neutral-500">Jenis Angkutan</label>
                <div className="font-medium">{selectedKendaraan.jenisAngkutan || '-'}</div>
              </div>
              <div>
                <label className="block text-xs text-neutral-500">Trayek</label>
                <div className="font-medium">{selectedKendaraan.trayek || '-'}</div>
              </div>
            </div>
          )}
        </div>
      </Card>
      
      <div className="text-sm text-neutral-500 flex items-center justify-center p-2 bg-blue-50 text-blue-800 rounded-md">
        <span className="mr-2">ℹ️</span> Data kendaraan otomatis terisi berdasarkan pilihan Anda.
      </div>
    </div>
  );
};
