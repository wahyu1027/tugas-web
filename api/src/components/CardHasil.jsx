import Badge from './Badge';

export default function CardHasil({ hasil }) {
  if (!hasil) return null;

  const persen = Math.min(hasil.skor_kelayakan, 100);
  const barColor =
    hasil.status === 'Sangat Layak'
      ? 'bg-gradient-to-r from-green-400 to-green-600'
      : hasil.status === 'Dipertimbangkan'
      ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
      : 'bg-gradient-to-r from-red-400 to-red-600';

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-fade-in">
      <div className="bg-linear-to-r from-green-500 to-emerald-600 px-6 py-4">
        <h2 className="text-white font-semibold text-lg flex items-center gap-2">
          <span>✅</span> Hasil Rekomendasi AI
        </h2>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-600 dark:text-slate-400">
              Skor Kelayakan
            </span>
            <span className="text-2xl font-bold text-indigo-600">
              {hasil.skor_kelayakan}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 rounded-full ${barColor} transition-all duration-1000`}
              style={{ width: `${persen}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between py-2 border-t border-gray-100">
          <span className="text-sm font-semibold text-gray-600 dark:text-slate-400">Status:</span>
          <Badge status={hasil.status} />
        </div>

        <div className="bg-indigo-50 dark:bg-slate-700 rounded-lg p-4 
                  border border-indigo-100 dark:border-slate-600">
          <p className="text-sm text-gray-700 dark:text-slate-300">
            <span className="font-semibold text-indigo-700">💡 Rekomendasi: </span>
            {hasil.rekomendasi}
          </p>
        </div>
      </div>
    </div>
  );
}