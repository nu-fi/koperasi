import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { History, CheckCircle } from 'lucide-react';

const LoanHistory = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper Format Rupiah
  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val || 0);
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('access');
        const response = await axios.get('http://127.0.0.1:8000/loans/history/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setHistoryData(response.data);
      } catch (error) {
        console.error("Gagal mengambil riwayat", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) return <div className="p-10 text-center">Memuat Riwayat...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <History className="w-8 h-8 text-amber-500" />
        <h1 className="text-2xl font-bold text-gray-800">Riwayat Peminjaman</h1>
      </div>

      {historyData.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-500 uppercase font-medium">
                <tr>
                  <th className="px-6 py-3">Tanggal Cair</th>
                  <th className="px-6 py-3">Jumlah Pinjaman</th>
                  <th className="px-6 py-3">Total Dibayar</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {historyData.map((loan) => (
                  <tr key={loan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {new Date(loan.disbursement_date).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {formatRupiah(loan.amount_disbursed)}
                    </td>
                    <td className="px-6 py-4">
                      {formatRupiah(loan.total_repayment)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" /> Lunas
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">Belum ada riwayat peminjaman yang lunas.</p>
        </div>
      )}
    </div>
  );
};

export default LoanHistory;