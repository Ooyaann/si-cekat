import { useInspeksi } from '../../context/InspeksiContext';
import { Card } from '../common/Card';
import { InspectionItem } from './InspectionItem';
import { formItems } from '../../data/formItems';

export const FormTeknisPenunjang = () => {
  const { formData, updateFormData } = useInspeksi();
  const sections = formItems.seksiIII;

  const handleChange = (id, value) => {
    updateFormData('seksiIII', { [id]: value });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <Card>
        <div className="mb-4 pb-2 border-b">
          <h2 className="text-lg font-semibold text-primary-900">Seksi III: Unsur Teknis Penunjang</h2>
          <p className="text-sm text-neutral-500">Pemeriksaan komponen pendukung kenyamanan dan tanggap darurat.</p>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-amber-800 font-medium flex items-center">
            <span className="mr-2">⚠️</span>
            Sanksi Pelanggaran Teknis Penunjang:
          </p>
          <p className="text-xs text-amber-700 mt-1 ml-6">
            Peringatan / Perbaiki (LAYAK JALAN DENGAN CATATAN)
          </p>
        </div>
      </Card>

      {Object.entries(sections).map(([key, section]) => (
        <Card key={key}>
          <h3 className="font-semibold text-primary-800 mb-3 flex items-center">
            <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs mr-2">{key}</span>
            {section.title}
          </h3>
          <div className="space-y-6 mt-5">
            {section.items.map(item => (
              <InspectionItem 
                key={item.id}
                item={item}
                value={formData.seksiIII[item.id]}
                onChange={handleChange}
              />
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};
