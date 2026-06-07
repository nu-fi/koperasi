import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, Wallet, CheckCircle, AlertCircle, Upload, X } from 'lucide-react';
import { toast } from "react-toastify";

const Repayment = () => {
  const [loanData, setLoanData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showUploadForm, setShowUploadForm] = useState(false);
  const [amount, setAmount] = useState('');
  const [proofOfPayment, setProofOfPayment] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Helper Format Rupiah (UPDATED)
  const formatRupiah = (value) => {
    if (value === undefined || value === null || value === "") {
        return "Rp 0";
    } 

    // 2. Paksa ubah string ke angka (Float)
    const number = parseFloat(value);

    // 3. Cek jika hasil konversi bukan angka (NaN)
    if (isNaN(number)) {
        return "Rp 0";
    }

    // 4. Format
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  const formatDisplayValue = (val) => {
    if (!val) return '';
    return new Intl.NumberFormat('id-ID').format(val);
  };

  // 2. HANDLER: Saat user mengetik
  const handleAmountChange = (e) => {
    // Ambil input user
    const rawValue = e.target.value;
    
    // Hapus semua karakter selain angka (hapus titik/koma)
    const cleanValue = rawValue.replace(/[^0-9]/g, '');
    
    // Simpan angka murninya ke state
    setAmount(cleanValue);
  };

  useEffect(() => {
    const fetchRepaymentData = async () => {
      try {
        const token = localStorage.getItem('access');
        const response = await axios.get('http://127.0.0.1:8000/loans/repayment/detail/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log("DATA DARI BACKEND:", response.data);
        console.log("Total Repayment:", response.data.total_repayment);
        console.log("Remaining:", response.data.remaining_amount);
        setLoanData(response.data);
      } catch (error) {
        console.error("Error fetching repayment data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepaymentData();
  }, []);

  if (loading) return <div className="p-10 text-center">Memuat Data Angsuran...</div>;
  if (!loanData) return <div className="p-10 text-center text-gray-500">Tidak ada tagihan aktif saat ini.</div>;

  const handleFileChange = (e) => {
    setProofOfPayment(e.target.files[0]);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !proofOfPayment) {
      toast.error("Harap isi jumlah bayar dan unggah bukti pembayaran.");
      return;
    }
    setUploading(true);
    try {
      const token = localStorage.getItem('access');
      const formData = new FormData();
      formData.append('amount_paid', amount.replace(/[^0-9]/g, '')); // Hapus format sebelum mengirim
      formData.append('proof_of_payment', proofOfPayment);

      await axios.post('http://127.0.0.1:8000/loans/repayment/upload/', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
      });
      toast.success("Bukti pembayaran berhasil diunggah. Menunggu verifikasi.");
      setShowUploadForm(false);
      // Refresh data setelah upload
      setAmount('');
      setProofOfPayment(null);        
    } catch (error) {
        console.error("Error uploading proof of payment", error);
        toast.error("Gagal mengunggah bukti pembayaran. Silakan coba lagi.");
    } finally {
        setUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Info Angsuran Saya</h1>

      {/* --- BAGIAN 1: KARTU RINGKASAN --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Kartu 1: Sisa Hutang */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
                <p className="text-sm text-gray-500 mb-1">Sisa Tagihan</p>
                <h3 className="text-2xl font-bold text-red-600">{formatRupiah(loanData.remaining_amount)}</h3>
            </div>
            <div className="mt-4 flex items-center text-xs text-gray-400">
                <Wallet className="w-4 h-4 mr-1" />
                <span>Total Pinjaman: {formatRupiah(loanData.total_repayment)}</span>
            </div>
        </div>

        {/* Kartu 2: Angsuran Bulanan */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
                <p className="text-sm text-gray-500 mb-1">Angsuran Per Bulan</p>
                <h3 className="text-2xl font-bold text-gray-800">{formatRupiah(loanData.monthly_installment)}</h3>
            </div>
            <div className="mt-4 flex items-center text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded w-fit">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Tenor: {loanData.tenor_months} Bulan</span>
            </div>
        </div>

        {/* Kartu 3: Jatuh Tempo */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
                <p className="text-sm text-gray-500 mb-1">Jatuh Tempo Berikutnya</p>
                <h3 className="text-2xl font-bold text-amber-600">
                    {/* Logika sederhana: Tampilkan tanggal tanggal due date */}
                    {new Date(loanData.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </h3>
            </div>
            <div className="mt-4 flex items-center text-xs text-gray-400">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span>Pastikan saldo cukup</span>
            </div>
        </div>
      </div>

      {/* --- BAGIAN TOMBOL UPLOAD --- */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-700">Riwayat Pembayaran</h3>
        <button 
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
            <Upload size={16} />
            Konfirmasi Pembayaran
        </button>
      </div>

      {/* --- FORM UPLOAD (MUNCUL JIKA DIKLIK) --- */}
      {showUploadForm && (
        <div className="mb-6 bg-green-50 border border-green-200 p-6 rounded-xl relative">
            <button 
                onClick={() => setShowUploadForm(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
                <X size={20} />
            </button>
            
            <h4 className="font-bold text-gray-800 mb-4">Form Konfirmasi Pembayaran</h4>
            
            <form onSubmit={handleUploadSubmit} className="space-y-4 max-w-md">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah yang Dibayar</label>
                    <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">Rp</span>
                        <input 
                            type="text" 
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                            placeholder="Contoh: 500000"
                            value={formatDisplayValue(amount)}
                            onChange={handleAmountChange}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bukti Transfer (Foto/Screenshot)</label>
                    <input 
                        type="file" 
                        accept="image/*"
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
                        onChange={handleFileChange}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={uploading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg disabled:bg-gray-400 transition"
                >
                    {uploading ? 'Mengirim...' : 'Kirim Bukti Pembayaran'}
                </button>
            </form>
        </div>
      )}

      {/* --- BAGIAN 2: TABEL RIWAYAT PEMBAYARAN --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-semibold text-gray-700">Riwayat Pembayaran</h3>
        </div> */}
        
        {loanData.repayments && loanData.repayments.length > 0 ? (
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-500 uppercase font-medium">
                        <tr>
                            <th className="px-6 py-3">Tanggal</th>
                            <th className="px-6 py-3">Jumlah Bayar</th>
                            <th className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loanData.repayments && loanData.repayments.map((log) => (
                            <tr key={log.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    {new Date(log.payment_date).toLocaleDateString('id-ID', {
                                        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                                    })}
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-800">
                                    {formatRupiah(log.amount_paid)}
                                </td>
                                <td className="px-6 py-4">
                                    {log.is_verified ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            <CheckCircle className="w-3 h-3 mr-1" /> Berhasil
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                            Menunggu Verifikasi
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <div className="p-8 text-center text-gray-400">
                Belum ada riwayat pembayaran.
            </div>
        )}
      </div>


    </div>
  );
};

export default Repayment;