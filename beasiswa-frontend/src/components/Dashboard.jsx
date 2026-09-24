import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line,
} from 'recharts';

const COLORS = {
  'Sangat Layak': '#10b981',
  'Dipertimbangkan': '#f59e0b',
  'Tidak Layak': '#ef4444',
};

export default function Dashboard({ riwayat, isDark }) {
  if (!riwayat || riwayat.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-12 text-center
                      transition-colors duration-300">
        <p className="text-6xl mb-4">📊</p>
        <h3 className="text-xl font-bold text-gray-700 dark:text-slate-200 mb-2">
          Belum Ada Data
        </h3>
        <p className="text-gray-500 dark:text-slate-400">
          Silakan ajukan beasiswa terlebih dahulu untuk melihat statistik
        </p>
      </div>
    );
  }

  // --- Statistik ---
  const total = riwayat.length;
  const avgSkor = (
    riwayat.reduce((sum, r) => sum + r.skor_kelayakan, 0) / total
  ).toFixed(1);

  const counts = {
    'Sangat Layak': riwayat.filter((r) => r.status === 'Sangat Layak').length,
    'Dipertimbangkan': riwayat.filter((r) => r.status === 'Dipertimbangkan').length,
    'Tidak Layak': riwayat.filter((r) => r.status === 'Tidak Layak').length,
  };

  // --- Data untuk Pie Chart ---
  const pieData = Object.entries(counts).map(([name, value]) => ({ name, value }));

  // --- Data untuk Bar Chart (IPK vs Skor) ---
  const barData = riwayat.slice(0, 10).map((r) => ({
    nama: r.mahasiswa_id.length > 10
      ? r.mahasiswa_id.substring(0, 10) + '...'
      : r.mahasiswa_id,
    IPK: r.ipk,
    'Skor Kelayakan': r.skor_kelayakan,
  }));

  // --- Data untuk Line Chart (Tren pengajuan per index) ---
  const lineData = riwayat
    .slice(0, 20)
    .reverse()
    .map((r, i) => ({
      urutan: i + 1,
      skor: r.skor_kelayakan,
    }));

  const textColor = isDark ? '#cbd5e1' : '#374151';
  const gridColor = isDark ? '#334155' : '#e5e7eb';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon="📋"
          label="Total Pengajuan"
          value={total}
          color="indigo"
        />
        <StatCard
          icon="⭐"
          label="Rata-rata Skor"
          value={`${avgSkor}%`}
          color="blue"
        />
        <StatCard
          icon="✅"
          label="Sangat Layak"
          value={counts['Sangat Layak']}
          color="green"
        />
        <StatCard
          icon="❌"
          label="Tidak Layak"
          value={counts['Tidak Layak']}
          color="red"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6
                        transition-colors duration-300">
          <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            🥧 Distribusi Status
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
                labelLine={false}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1e293b' : '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  color: textColor,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6
                        transition-colors duration-300">
          <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            📈 Tren Skor Kelayakan
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="urutan" stroke={textColor} />
              <YAxis stroke={textColor} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1e293b' : '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  color: textColor,
                }}
              />
              <Line
                type="monotone"
                dataKey="skor"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ fill: '#6366f1', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart Full Width */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6
                      transition-colors duration-300">
        <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          📊 Perbandingan IPK & Skor Kelayakan (10 Terbaru)
        </h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="nama" stroke={textColor} angle={-15} textAnchor="end" height={80} />
            <YAxis stroke={textColor} />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1e293b' : '#fff',
                border: 'none',
                borderRadius: '8px',
                color: textColor,
              }}
            />
            <Legend />
            <Bar dataKey="IPK" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            <Bar dataKey="Skor Kelayakan" fill="#06b6d4" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// --- Komponen Stat Card ---
function StatCard({ icon, label, value, color }) {
  const colors = {
    indigo: 'from-indigo-500 to-indigo-600',
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    red: 'from-red-500 to-red-600',
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden
                    transition-colors duration-300 hover:shadow-xl">
      <div className={`bg-linear-to-r ${colors[color]} px-4 py-3`}>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-500 dark:text-slate-400 font-medium uppercase tracking-wide">
          {label}
        </p>
        <p className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mt-1">
          {value}
        </p>
      </div>
    </div>
  );
}