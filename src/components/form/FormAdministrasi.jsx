import { useInspeksi } from '../../context/InspeksiContext';
import { Card } from '../common/Card';
import { InspectionItem } from './InspectionItem';
import { formItems } from '../../data/formItems';

export const FormAdministrasi = () => {
  const { formData, updateFormData } = useInspeksi();
  const items = formItems.seksiI;

  const handleChange = (id, value) => {
    updateFormData('seksiI', { [id]: value });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <Card>
        <div className="mb-4 pb-2 border-b">
          <h2 className="text-lg font-semibold text-primary-900">Seksi I: Unsur Administrasi</h2>
          <p className="text-sm text-neutral-500">Pemeriksaan kelengkapan dokumen kendaraan dan pengemudi.</p>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-red-800 font-medium flex items-center">
            <span className="mr-2">⚠️</span>
            Sanksi Pelanggaran Administrasi:
          </p>
          <p className="text-xs text-red-700 mt-1 ml-6">
            Tilang & Dilarang Operasional (TIDAK LAYAK JALAN)
          </p>
        </div>

        <div className="space-y-6 mt-5">
          {items.map(item => (
            <InspectionItem 
              key={item.id}
              item={item}
              value={formData.seksiI[item.id]}
              onChange={handleChange}
            />
          ))}
        </div>
      </Card>
    </div>
  );
};
