import Badge from './Badge';

export default function TabelRiwayat({ data, loading }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="bg-gray-800 px-6 py-4 flex justify-between items-center">
        <h2 className="text-white font-semibold text-lg flex items-center gap-2">
          <span>📋</span> Riwayat Pengajuan
        </h2>
        <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
          {data.length} data
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Nama Mahasiswa
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                IPK
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Gaji Ortu
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Skor
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-400">
                  <svg className="animate-spin h-6 w-6 mx-auto" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10"
                            stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <p className="mt-2 text-sm">Memuat data...</p>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-400">
                  <p className="text-4xl mb-2">📭</p>
                  <p className="text-sm">Belum ada data pengajuan</p>
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-indigo-50/50 transition">
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">
                    {item.mahasiswa_id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.ipk}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    Rp {item.penghasilan_ortu} Jt
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-indigo-600">
                        {item.skor_kelayakan}%
                      </span>
                      <div className="w-16 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-indigo-500 h-1.5 rounded-full"
                          style={{ width: `${Math.min(item.skor_kelayakan, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge status={item.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}