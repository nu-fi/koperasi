import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL + "/loans/apply/";

const ApplyLoan = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    amount_requested: '',       
    tenor_months_requested: '12', 
    purpose: ''
  });

  // 1. Helper: Format angka ke tampilan Rupiah (10000 -> "10.000")
  const formatRupiah = (value) => {
    if (!value) return '';
    // Hapus karakter non-digit agar bersih
    const rawValue = value.toString().replace(/[^0-9]/g, '');
    // Format jadi ribuan indonesia
    return new Intl.NumberFormat('id-ID').format(rawValue);
  };

  // 2. Handle Change KHUSUS untuk Amount
  const handleAmountChange = (e) => {
    // Ambil value dari input
    const value = e.target.value;
    
    // Bersihkan titik/koma, ambil angkanya saja untuk disimpan di State
    const rawValue = value.replace(/\./g, '');

    // Cek apakah user input angka valid
    if (!isNaN(rawValue)) {
      setFormData({ ...formData, amount_requested: rawValue });
    }
  };

  // Handle Change untuk input lain (Select, Textarea)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('access');
      
      // Data yang dikirim ke backend sudah bersih (angka murni) karena state kita simpan rawValue
      await axios.post(BACKEND_URL, formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      toast.success("Pengajuan berhasil!");
      navigate('/dashboard'); 

    } catch (error) {
      console.error(error);
      toast.error("Gagal mengajukan pinjaman.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">
        Formulir Pengajuan Pembiayaan
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* 1. AMOUNT INPUT (UPDATED) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Jumlah Pengajuan (Rp)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500 font-semibold">Rp</span>
            <input
              type="text" // Ubah jadi TEXT agar bisa menerima titik
              name="amount_requested"
              required
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
              placeholder="Contoh: 5.000.000"
              // Tampilkan value yang sudah diformat
              value={formatRupiah(formData.amount_requested)}
              // Gunakan handler khusus
              onChange={handleAmountChange}
            />
          </div>
        </div>

        {/* 2. DURATION INPUT (Sama seperti sebelumnya) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Jangka Waktu (Bulan)
          </label>
          <select
            name="tenor_months_requested"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white"
            onChange={handleChange}
            value={formData.tenor_months_requested}
          >
            <option value="3">3 Bulan</option>
            <option value="6">6 Bulan</option>
            <option value="12">12 Bulan</option>
            <option value="24">24 Bulan</option>
          </select>
        </div>

        {/* 3. PURPOSE INPUT (Sama seperti sebelumnya) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Keperluan
          </label>
          <textarea
            name="purpose"
            required
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none transition"
            onChange={handleChange}
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-lg transition duration-300"
        >
          {loading ? 'Sedang Memproses...' : 'Ajukan Sekarang'}
        </button>

      </form>
    </div>
  );
};

export default ApplyLoan;