import { useState } from 'react';

export default function ExplainabilityPanel({ hasil }) {
  const [open, setOpen] = useState(false);

  if (!hasil || !hasil.detail_fuzzy) return null;

  // Parse JSON dari backend
  let fuzzifikasi = {};
  let rulesAktif = [];
  try {
    fuzzifikasi = typeof hasil.detail_fuzzy === 'string'
      ? JSON.parse(hasil.detail_fuzzy)
      : hasil.detail_fuzzy;
    rulesAktif = typeof hasil.rules_aktif === 'string'
      ? JSON.parse(hasil.rules_aktif)
      : hasil.rules_aktif || [];
  } catch (e) {
    console.error('Parse error:', e);
    return null;
  }

  return (
    <div className="mt-4 border border-indigo-200 dark:border-slate-600 
                    rounded-xl overflow-hidden bg-white dark:bg-slate-800">
      {/* Header Collapsible */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 
                   bg-indigo-50 dark:bg-slate-700 
                   hover:bg-indigo-100 dark:hover:bg-slate-600 transition"
      >
        <span className="flex items-center gap-2 font-semibold 
                         text-indigo-800 dark:text-indigo-300">
          🔍 Kenapa skor ini? (Lihat penjelasan)
        </span>
        <span className={`transition-transform text-indigo-600 
                          dark:text-indigo-400 ${open ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {/* Content */}
      {open && (
        <div className="p-4 space-y-5 text-sm">

          {/* ============ 1. FUZZIFIKASI ============ */}
          <section>
            <h4 className="font-bold text-indigo-700 dark:text-indigo-300 
                           mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900 
                               flex items-center justify-center text-xs">
                1
              </span>
              Fuzzifikasi (Derajat Keanggotaan)
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 ml-8">
              Setiap nilai input diubah ke derajat keanggotaan (0.0 - 1.0) 
              untuk setiap kategori fuzzy.
            </p>

            {/* IPK */}
            <div className="ml-8 mb-3">
              <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">
                📚 IPK: {fuzzifikasi.ipk?.nilai}
              </p>
              <div className="space-y-1.5">
                {Object.entries(fuzzifikasi.ipk?.derajat || {}).map(([label, val]) => (
                  <MembershipBar key={label} label={label} value={val} />
                ))}
              </div>
            </div>

            {/* Penghasilan */}
            <div className="ml-8">
              <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">
                💰 Penghasilan:{' '}
                Rp {parseInt(fuzzifikasi.penghasilan?.nilai || 0).toLocaleString('id-ID')}
              </p>
              <div className="space-y-1.5">
                {Object.entries(fuzzifikasi.penghasilan?.derajat || {}).map(([label, val]) => (
                  <MembershipBar key={label} label={label} value={val} />
                ))}
              </div>
            </div>
          </section>

          {/* ============ 2. RULES AKTIF ============ */}
          <section>
            <h4 className="font-bold text-indigo-700 dark:text-indigo-300 
                           mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900 
                               flex items-center justify-center text-xs">
                2
              </span>
              Rule yang Aktif ({rulesAktif.length})
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 ml-8">
              Rule yang ter-trigger beserta nilai α-predikat (kekuatan).
            </p>

            <div className="ml-8 space-y-2">
              {rulesAktif.length === 0 ? (
                <p className="text-xs text-slate-400 italic">
                  Tidak ada rule yang aktif
                </p>
              ) : (
                rulesAktif.map((r) => (
                  <div
                    key={r.kode}
                    className="p-3 bg-slate-50 dark:bg-slate-700/50 
                               rounded-lg border border-slate-200 dark:border-slate-600"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold 
                                       text-indigo-600 dark:text-indigo-400">
                        {r.kode}
                      </span>
                      <span className="text-xs font-bold 
                                       text-emerald-600 dark:text-emerald-400">
                        α = {r.alpha.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      <span className="font-semibold">IF</span> {r.kondisi}
                    </p>
                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      <span className="font-semibold">THEN</span>{' '}
                      <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                        {r.konsekuen}
                      </span>
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* ============ 3. KESIMPULAN ============ */}
          <section>
            <h4 className="font-bold text-indigo-700 dark:text-indigo-300 
                           mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900 
                               flex items-center justify-center text-xs">
                3
              </span>
              Kesimpulan
            </h4>
            <div className="ml-8 p-3 bg-emerald-50 dark:bg-emerald-900/20 
                            rounded-lg border border-emerald-200 dark:border-emerald-800">
              <p className="text-sm text-slate-700 dark:text-slate-200">
                {hasil.kesimpulan || 'Tidak ada kesimpulan.'}
              </p>
            </div>
          </section>

        </div>
      )}
    </div>
  );
}


// ============================================================
// SUB-KOMPONEN: Bar untuk derajat keanggotaan
// ============================================================
function MembershipBar({ label, value }) {
  const persen = Math.round(value * 100);
  const isDominan = value > 0.5;

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-600 dark:text-slate-400 
                       w-28 capitalize">
        {label.replace(/_/g, ' ')}
      </span>
      <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 
                      overflow-hidden">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ${
            isDominan
              ? 'bg-linear-to-r from-indigo-500 to-purple-500'
              : 'bg-slate-400 dark:bg-slate-500'
          }`}
          style={{ width: `${persen}%` }}
        />
      </div>
      <span className={`text-xs font-bold w-12 text-right ${
        isDominan
          ? 'text-indigo-600 dark:text-indigo-400'
          : 'text-slate-500 dark:text-slate-400'
      }`}>
        {value.toFixed(2)}
      </span>
      {isDominan && <span className="text-xs">⭐</span>}
    </div>
  );
}