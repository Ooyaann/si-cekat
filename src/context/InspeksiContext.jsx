/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const InspeksiContext = createContext();

const initialFormData = {
  kendaraanId: '',
  tanggal: new Date().toISOString().split('T')[0],
  lokasiTipe: 'Pool', // Pool, Terminal, Lainnya
  lokasiNama: '',
  seksiI: {},
  seksiII: {},
  seksiIII: {},
  fotoUmum: [],
  catatan: '',
  tandaTangan: null,
  waktuMulai: new Date().toISOString()
};

export function InspeksiProvider({ children }) {
  const [currentStep, setCurrentStep] = useState(() => {
    const saved = localStorage.getItem('sicekat_inspeksi_draft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.currentStep || 1;
      } catch {
        return 1;
      }
    }
    return 1;
  });

  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('sicekat_inspeksi_draft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.formData || initialFormData;
      } catch {
        return initialFormData;
      }
    }
    return initialFormData;
  });

  // Save to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sicekat_inspeksi_draft', JSON.stringify({ formData, currentStep }));
  }, [formData, currentStep]);

  const updateFormData = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: typeof data === 'object' && !Array.isArray(data) && section !== 'lokasiTipe' && section !== 'lokasiNama' && section !== 'kendaraanId' && section !== 'catatan' && section !== 'tandaTangan'
        ? { ...prev[section], ...data }
        : data
    }));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 6));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const resetForm = () => {
    setFormData({ ...initialFormData, tanggal: new Date().toISOString().split('T')[0], waktuMulai: new Date().toISOString() });
    setCurrentStep(1);
    localStorage.removeItem('sicekat_inspeksi_draft');
  };

  return (
    <InspeksiContext.Provider value={{
      currentStep,
      setCurrentStep,
      formData,
      updateFormData,
      nextStep,
      prevStep,
      resetForm
    }}>
      {children}
    </InspeksiContext.Provider>
  );
}

export const useInspeksi = () => useContext(InspeksiContext);
