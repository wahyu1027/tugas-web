export default function Badge({ status }) {
  const styles = {
    'Sangat Layak': 'bg-green-100 text-green-800 border border-green-300',
    'Dipertimbangkan': 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    'Tidak Layak': 'bg-red-100 text-red-800 border border-red-300',
  };

  const cls = styles[status] || 'bg-gray-100 text-gray-800 border border-gray-300';

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${cls}`}>
      {status}
    </span>
  );
}