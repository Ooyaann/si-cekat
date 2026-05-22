/* eslint-disable react-refresh/only-export-components, react-hooks/set-state-in-effect */
import { createContext, useContext, useState, useEffect, useMemo } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [supirList, setSupirList] = useState([]);
  const [kendaraanList, setKendaraanList] = useState([]);
  const [inspeksiList, setInspeksiList] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async (forceReset = false) => {
    try {
      setLoading(true);
      
      // Load supir
      const storedSupir = localStorage.getItem('sicekat_supir');
      if (storedSupir && !forceReset) {
        setSupirList(JSON.parse(storedSupir));
      } else {
        const supirRes = await fetch('/data/supir.json');
        const supirData = await supirRes.json();
        setSupirList(supirData);
        localStorage.setItem('sicekat_supir', JSON.stringify(supirData));
      }

      // Load kendaraan
      const storedKendaraan = localStorage.getItem('sicekat_kendaraan');
      if (storedKendaraan && !forceReset) {
        setKendaraanList(JSON.parse(storedKendaraan));
      } else {
        const kendaraanRes = await fetch('/data/kendaraan.json');
        const kendaraanData = await kendaraanRes.json();
        setKendaraanList(kendaraanData);
        localStorage.setItem('sicekat_kendaraan', JSON.stringify(kendaraanData));
      }

      // Load inspeksi
      const storedInspeksi = localStorage.getItem('sicekat_inspeksi');
      if (storedInspeksi && !forceReset) {
        setInspeksiList(JSON.parse(storedInspeksi));
      } else {
        const inspeksiRes = await fetch('/data/inspeksi-sample.json');
        const inspeksiSample = await inspeksiRes.json();
        setInspeksiList(inspeksiSample);
        localStorage.setItem('sicekat_inspeksi', JSON.stringify(inspeksiSample));
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addInspeksi = (newInspeksi) => {
    const updatedList = [newInspeksi, ...inspeksiList];
    setInspeksiList(updatedList);
    localStorage.setItem('sicekat_inspeksi', JSON.stringify(updatedList));
  };

  const addKendaraan = (newKendaraan) => {
    const updatedList = [...kendaraanList, newKendaraan];
    setKendaraanList(updatedList);
    localStorage.setItem('sicekat_kendaraan', JSON.stringify(updatedList));
  };

  const addSupir = (newSupir) => {
    const updatedList = [...supirList, newSupir];
    setSupirList(updatedList);
    localStorage.setItem('sicekat_supir', JSON.stringify(updatedList));
  };

  const updateKendaraan = (updatedKendaraan) => {
    const updatedList = kendaraanList.map(k => k.id === updatedKendaraan.id ? updatedKendaraan : k);
    setKendaraanList(updatedList);
    localStorage.setItem('sicekat_kendaraan', JSON.stringify(updatedList));
  };

  const updateSupir = (updatedSupir) => {
    const updatedList = supirList.map(s => s.id === updatedSupir.id ? updatedSupir : s);
    setSupirList(updatedList);
    localStorage.setItem('sicekat_supir', JSON.stringify(updatedList));
  };

  const [readNotifIds, setReadNotifIds] = useState(() => {
    const stored = localStorage.getItem('sicekat_read_notifications');
    return stored ? JSON.parse(stored) : [];
  });
  const [isNotificationsCleared, setIsNotificationsCleared] = useState(() => {
    return localStorage.getItem('sicekat_notifications_cleared') === 'true';
  });

  const notifications = useMemo(() => {
    if (isNotificationsCleared) return [];
    
    const list = [];

    // 1. Inspeksi
    inspeksiList.forEach(ins => {
      const bus = kendaraanList.find(k => k.id === ins.kendaraanId);
      const driver = supirList.find(s => s.id === ins.supirId);
      
      if (ins.hasil?.statusFinal === 'TIDAK_LAYAK' || ins.hasil?.statusFinal === 'TIDAK LAYAK') {
        const notifId = `notif-tl-${ins.id}`;
        list.push({
          id: notifId,
          tipe: 'kritis',
          judul: 'Kritis: Armada Tidak Layak Jalan',
          pesan: `Bus ${bus?.nomorPolisi || 'B 1234 CD'} (${bus?.namaPO || 'PO'}) dinyatakan TIDAK LAYAK setelah inspeksi oleh driver ${driver?.nama || 'Supir'}. Sanksi: ${ins.hasil.sanksi?.replace(/_/g, ' ') || 'Tidak boleh jalan'}.`,
          waktu: ins.waktuSubmit || ins.tanggal,
          supirId: ins.supirId,
          dibaca: readNotifIds.includes(notifId)
        });
      } else if (ins.hasil?.statusFinal === 'PERINGATAN') {
        const notifId = `notif-pw-${ins.id}`;
        list.push({
          id: notifId,
          tipe: 'peringatan',
          judul: 'Peringatan Kelayakan',
          pesan: `Bus ${bus?.nomorPolisi || 'B 1234 CD'} mendapatkan status PERINGATAN. Ada beberapa item minor yang perlu diperbaiki.`,
          waktu: ins.waktuSubmit || ins.tanggal,
          supirId: ins.supirId,
          dibaca: readNotifIds.includes(notifId)
        });
      }

      // 2. Durasi Cepat
      if (ins.durasiDetik < 180) {
        const notifId = `notif-dur-${ins.id}`;
        list.push({
          id: notifId,
          tipe: 'peringatan',
          judul: 'Pencurigaan Pengisian Cepat',
          pesan: `Pengisian inspeksi oleh supir ${driver?.nama || 'Supir'} selesai sangat cepat (${Math.floor(ins.durasiDetik / 60)} menit ${ins.durasiDetik % 60} detik). Silakan cek integritas data.`,
          waktu: ins.waktuSubmit || ins.tanggal,
          supirId: ins.supirId,
          dibaca: readNotifIds.includes(notifId)
        });
      }
    });

    // 3. Dokumen Kedaluwarsa
    kendaraanList.forEach(bus => {
      const hitungSisaHari = (tglStr) => {
        if (!tglStr) return 999;
        return Math.ceil((new Date(tglStr) - new Date()) / (1000 * 60 * 60 * 24));
      };

      const sisaSTUK = hitungSisaHari(bus.dokumen?.stuk?.berlakuSampai);
      const sisaKP = hitungSisaHari(bus.dokumen?.kpReguler?.berlakuSampai);

      if (sisaSTUK <= 0) {
        const notifId = `notif-doc-kir-${bus.id}`;
        list.push({
          id: notifId,
          tipe: 'kritis',
          judul: 'Dokumen KIR Kedaluwarsa',
          pesan: `Masa berlaku KIR/STUK armada ${bus.nomorPolisi} (${bus.namaPO}) telah HABIS. Segera lakukan pengurusan perpanjangan dokumen.`,
          waktu: new Date().toISOString(),
          dibaca: readNotifIds.includes(notifId)
        });
      } else if (sisaSTUK <= 30) {
        const notifId = `notif-doc-kir2-${bus.id}`;
        list.push({
          id: notifId,
          tipe: 'info',
          judul: 'Masa Berlaku KIR Hampir Habis',
          pesan: `Masa berlaku KIR/STUK armada ${bus.nomorPolisi} tinggal ${sisaSTUK} hari lagi.`,
          waktu: new Date().toISOString(),
          dibaca: readNotifIds.includes(notifId)
        });
      }

      if (sisaKP <= 0) {
        const notifId = `notif-doc-kp-${bus.id}`;
        list.push({
          id: notifId,
          tipe: 'kritis',
          judul: 'KP Reguler Kedaluwarsa',
          pesan: `Masa berlaku Kartu Pengawasan (KP) armada ${bus.nomorPolisi} (${bus.namaPO}) telah HABIS.`,
          waktu: new Date().toISOString(),
          dibaca: readNotifIds.includes(notifId)
        });
      }
    });

    // 4. Supir SIM Expiry
    supirList.forEach(supir => {
      const hitungSisaHari = (tglStr) => {
        if (!tglStr) return 999;
        return Math.ceil((new Date(tglStr) - new Date()) / (1000 * 60 * 60 * 24));
      };

      const sisaSIM = hitungSisaHari(supir.masaBerlakuSIM);
      if (sisaSIM <= 30) {
        const notifId = `notif-sim-${supir.id}`;
        const isExpired = sisaSIM <= 0;
        list.push({
          id: notifId,
          tipe: isExpired ? 'kritis' : 'peringatan',
          judul: isExpired ? 'SIM Kedaluwarsa' : 'Masa Berlaku SIM Hampir Habis',
          pesan: isExpired 
            ? `Masa berlaku SIM supir ${supir.nama} telah HABIS. Supir tidak diijinkan berkendara.`
            : `Masa berlaku SIM supir ${supir.nama} tinggal ${sisaSIM} hari lagi.`,
          waktu: new Date().toISOString(),
          supirId: supir.id,
          dibaca: readNotifIds.includes(notifId)
        });
      }
    });

    // Sort by waktu desc
    return list.sort((a, b) => new Date(b.waktu) - new Date(a.waktu));
  }, [inspeksiList, kendaraanList, supirList, readNotifIds, isNotificationsCleared]);

  const unreadNotifCount = useMemo(() => {
    return notifications.filter(n => !n.dibaca).length;
  }, [notifications]);

  const markNotifAsRead = (id) => {
    setReadNotifIds(prev => {
      const updated = [...prev, id];
      localStorage.setItem('sicekat_read_notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const markAllNotifsAsRead = () => {
    const allIds = notifications.map(n => n.id);
    setReadNotifIds(allIds);
    localStorage.setItem('sicekat_read_notifications', JSON.stringify(allIds));
  };

  const clearNotifications = () => {
    setIsNotificationsCleared(true);
    localStorage.setItem('sicekat_notifications_cleared', 'true');
  };

  const resetSimulasi = async () => {
    localStorage.removeItem('sicekat_supir');
    localStorage.removeItem('sicekat_kendaraan');
    localStorage.removeItem('sicekat_inspeksi');
    localStorage.removeItem('sicekat_inspeksi_draft');
    localStorage.removeItem('sicekat_read_notifications');
    localStorage.removeItem('sicekat_notifications_cleared');
    setIsNotificationsCleared(false);
    setReadNotifIds([]);
    await loadData(true);
  };

  const getKendaraanById = (id) => kendaraanList.find(k => k.id === id);
  const getSupirById = (id) => supirList.find(s => s.id === id);

  return (
    <DataContext.Provider value={{
      supirList,
      kendaraanList,
      inspeksiList,
      loading,
      addInspeksi,
      addKendaraan,
      addSupir,
      updateKendaraan,
      updateSupir,
      resetSimulasi,
      getKendaraanById,
      getSupirById,
      notifications,
      unreadNotifCount,
      markNotifAsRead,
      markAllNotifsAsRead,
      clearNotifications
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
