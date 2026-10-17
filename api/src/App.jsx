import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import FormPengajuan from './components/FormPengajuan';
import CardHasil from './components/CardHasil';
import TabelRiwayat from './components/TabelRiwayat';
import Dashboard from './components/Dashboard';
import useDarkMode from './hooks/useDarkMode';
import { rekomendasiApi } from './services/api';

export default function App() {
  const [riwayat, setRiwayat] = useState([]);
  const [hasil, setHasil] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingTabel, setLoadingTabel] = useState(true);
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState('form'); // 'form' | 'dashboard'
  const { isDark } = useDarkMode();

  useEffect(() => {
    loadRiwayat();
  }, []);

  const loadRiwayat = async () => {
    setLoadingTabel(true);
    try {
      const data = await rekomendasiApi.getAll();
      setRiwayat(data);
    } catch (err) {
      console.error('Gagal memuat riwayat:', err);
      showToast('Gagal memuat riwayat', 'error');
    } finally {
      setLoadingTabel(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (payload) => {
    setLoading(true);
    try {
      const result = await rekomendasiApi.submit(payload);
      setHasil(result);
      showToast('Data berhasil diproses!', 'success');
      await loadRiwayat();
    } catch (err) {
      console.error('Submit error:', err);
      const msg = err.response?.data?.detail || 'Gagal memproses data';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50
                    dark:from-slate-900 dark:via-slate-900 dark:to-slate-800
                    transition-colors duration-300">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentPage === 'form' ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 animate-fade-in">
            {/* Kolom Kiri: Form */}
            <div className="lg:col-span-2 space-y-6">
              <FormPengajuan onSubmit={handleSubmit} loading={loading} />
            </div>

            {/* Kolom Kanan: Hasil & Tabel */}
            <div className="lg:col-span-3 space-y-6">
              <CardHasil hasil={hasil} />
              <TabelRiwayat data={riwayat} loading={loadingTabel} />
            </div>
          </div>
        ) : (
          <Dashboard riwayat={riwayat} isDark={isDark} />
        )}
      </main>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 px-6 py-4 rounded-lg shadow-2xl 
                      text-white font-medium animate-slide-in z-50
                      ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}
        >
          {toast.type === 'error' ? '❌' : '✅'} {toast.message}
        </div>
      )}

      <footer className="text-center py-6 text-sm text-gray-500 dark:text-slate-400">
        © 2026 Sistem Rekomendasi Beasiswa — Fuzzy Logic AI
      </footer>
    </div>
  );
}