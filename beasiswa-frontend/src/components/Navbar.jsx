import useDarkMode from '../hooks/useDarkMode';

export default function Navbar({ currentPage, setCurrentPage }) {
  const { isDark, toggle } = useDarkMode();

  return (
    <nav className="bg-linear-to-r from-indigo-600 to-purple-600 
                    dark:from-slate-800 dark:to-slate-900 shadow-lg 
                    transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <span className="text-3xl"></span>
            <div>
              <h1 className="text-white font-bold text-lg md:text-xl">
                Sistem Rekomendasi Beasiswa
              </h1>
              <p className="text-indigo-100 dark:text-slate-400 text-xs">
                Fuzzy Logic AI Engine
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage('form')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentPage === 'form'
                  ? 'bg-white text-indigo-600 shadow-md'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              📝 Pengajuan
            </button>
            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentPage === 'dashboard'
                  ? 'bg-white text-indigo-600 shadow-md'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              📊 Dashboard
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggle}
              className="ml-2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 
                         text-white flex items-center justify-center transition-all
                         hover:scale-110 active:scale-95"
              title={isDark ? 'Light Mode' : 'Dark Mode'}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}