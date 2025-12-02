import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, Wallet, CheckCircle, AlertCircle } from 'lucide-react';

const Repayment = () => {
  const [loanData, setLoanData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper Format Rupiah
  // Helper Format Rupiah (UPDATED)
  const formatRupiah = (value) => {
    // 1. Cek jika kosong
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

      {/* --- BAGIAN 2: TABEL RIWAYAT PEMBAYARAN --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-semibold text-gray-700">Riwayat Pembayaran</h3>
        </div>
        
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