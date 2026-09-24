import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/v1';

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