import { useState } from 'react';

export default function FormPengajuan({ onSubmit, loading }) {
  const [form, setForm] = useState({
    mahasiswa_id: '',
    ipk: '',
    penghasilan_ortu: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      mahasiswa_id: form.mahasiswa_id.trim(),
      ipk: parseFloat(form.ipk),
      penghasilan_ortu: parseFloat(form.penghasilan_ortu),
    });
    setForm({ mahasiswa_id: '', ipk: '', penghasilan_ortu: '' });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden transition-colors duration-300">
      <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-4">
        <h2 className="text-white font-semibold text-lg flex items-center gap-2">
           Form Pengajuan Beasiswa
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
            Nama Mahasiswa
          </label>
          <input
            type="text"
            name="mahasiswa_id"
            value={form.mahasiswa_id}
            onChange={handleChange}
            placeholder="Contoh: Budi Santoso"
            required
           className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 
             bg-white dark:bg-slate-700 text-gray-800 dark:text-white
             rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 
             focus:border-transparent transition placeholder-gray-400 dark:placeholder-slate-500" //i
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            IPK <span className="text-gray-400 font-normal">(0.00 - 4.00)</span>
          </label>
          <input
            type="number"
            name="ipk"
            step="0.01"
            min="0"
            max="4"
            value={form.ipk}
            onChange={handleChange}
            placeholder="3.50"
            required
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 
             bg-white dark:bg-slate-700 text-gray-800 dark:text-white
             rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 
             focus:border-transparent transition placeholder-gray-400 dark:placeholder-slate-500" //i
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Penghasilan Orang Tua
            <span className="text-gray-400 font-normal"> (Juta Rp)</span>
          </label>
          <input
            type="number"
            name="penghasilan_ortu"
            step="0.1"
            min="0"
            value={form.penghasilan_ortu}
            onChange={handleChange}
            placeholder="2.5"
            required
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 
             bg-white dark:bg-slate-700 text-gray-800 dark:text-white
             rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 
             focus:border-transparent transition placeholder-gray-400 dark:placeholder-slate-500" //i
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-linear-to-r from-indigo-600 to-purple-600 
                     text-white font-semibold py-3 rounded-lg shadow-md 
                     hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 
                     transition-all duration-200 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" 
                        stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Memproses...
            </>
          ) : (
            <>🚀 Proses AI</>
          )}
        </button>
      </form>
    </div>
  );
}