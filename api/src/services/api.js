import axios from 'axios';

// HAPUS URL localhost, ganti dengan jalur relatif Vercel
const API_URL = '/api/v1'; 

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const rekomendasiApi = {
  // Kirim data ke fuzzy engine
  async submit(data) {
    const res = await api.post('/rekomendasi', data);
    return res.data;
  },

  // Ambil semua riwayat
  async getAll() {
    const res = await api.get('/riwayat');
    return res.data;
  },
};
