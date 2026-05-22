import { useInspeksi } from '../../context/InspeksiContext';
import { Card } from '../common/Card';
import { InspectionItem } from './InspectionItem';
import { formItems } from '../../data/formItems';

export const FormTeknisUtama = () => {
  const { formData, updateFormData } = useInspeksi();
  const sections = formItems.seksiII;

  const handleChange = (id, value) => {
    updateFormData('seksiII', { [id]: value });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <Card>
        <div className="mb-4 pb-2 border-b">
          <h2 className="text-lg font-semibold text-primary-900">Seksi II: Unsur Teknis Utama</h2>
          <p className="text-sm text-neutral-500">Pemeriksaan komponen teknis krusial untuk keselamatan.</p>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-red-800 font-medium flex items-center">
            <span className="mr-2">⚠️</span>
            Sanksi Pelanggaran Teknis Utama:
          </p>
          <p className="text-xs text-red-700 mt-1 ml-6">
            Dilarang Operasional (TIDAK LAYAK JALAN)
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
                value={formData.seksiII[item.id]}
                onChange={handleChange}
              />
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};
