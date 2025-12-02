import React, { useState, useEffect } from "react";
import {} from 'lucide-react';

const CalculatorModal = ({ isOpen, onClose, productName = "Pembiayaan Barang" }) => {
  // State untuk input
  const [price, setPrice] = useState(5000000); // Default 10 Juta
  const [dpPercent, setDpPercent] = useState(0); // Default DP 20%
  const [tenor, setTenor] = useState(12); // Default 12 Bulan
  const [margin, setMargin] = useState(30); // Margin keuntungan per tahun (setara)

  // State untuk hasil perhitungan
  const [result, setResult] = useState({
    dpAmount: 0,
    principal: 0,
    totalMargin: 0,
    totalPrice: 0,
    monthlyInstallment: 0,
  });

  // Fungsi menghitung simulasi
  useEffect(() => {
    const dpAmount = (price * dpPercent) / 100;
    const principal = price - dpAmount; // Pokok pembiayaan
    
    // Rumus Sederhana Murabahah (Flat/Anuitas tergantung kebijakan, ini contoh Flat)
    // Total Margin = Pokok x (Margin% per tahun / 100) x (Tenor / 12 bulan)
    const totalMargin = principal * (margin / 100) * (tenor / 12);
    
    const totalPrice = principal + totalMargin;
    const monthlyInstallment = totalPrice / tenor;

    setResult({
      dpAmount,
      principal,
      totalMargin,
      totalPrice,
      monthlyInstallment,
    });
  }, [price, dpPercent, tenor, margin]);

  // Formatter Rupiah
  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const handlePriceChange = (e) => {
  // 1. Ambil value dari input
  const inputValue = e.target.value;

  // 2. Hapus semua karakter yang BUKAN angka (termasuk Rp, titik, koma)
  const numericString = inputValue.replace(/[^0-9]/g, "");
  
  // 3. Ubah jadi number agar bisa disimpan di state 'price'
  const numericValue = Number(numericString);

  // 4. Update state (ini yang dipakai untuk hitungan matematika)
  setPrice(numericValue);
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header Modal */}
        <div className="bg-amber-600 p-4 flex justify-between items-center text-white">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>
            Simulasi {productName}
          </h3>
          <button onClick={onClose} className="hover:bg-amber-700 p-1 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
          </button>
        </div>

        {/* Body Modal */}
        <div className="p-6 space-y-4">
          
          {/* Input: Harga Barang */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
            Harga Barang/Jasa
            </label>
            <input
            type="text" // Ubah jadi text agar bisa ada format Rp dan titik
            value={formatRupiah(price)} // Tampilkan nilai yang sudah diformat
            onChange={handlePriceChange} // Panggil fungsi handler di atas
            placeholder="Rp 0"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Input: DP */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Uang Muka (DP %)</label>
              <select 
                value={dpPercent} 
                onChange={(e) => setDpPercent(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              >
                <option value="0">0% (Tanpa DP)</option>
                <option value="10">10%</option>
                <option value="20">20%</option>
                <option value="30">30%</option>
              </select>
            </div>
            
            {/* Input: Tenor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jangka Waktu</label>
              <select 
                value={tenor} 
                onChange={(e) => setTenor(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              >
                <option value="6">6 Bulan</option>
                <option value="12">12 Bulan (1 Thn)</option>
                <option value="24">24 Bulan (2 Thn)</option>
                <option value="36">36 Bulan (3 Thn)</option>
              </select>
            </div>
          </div>

          {/* Result Section */}
          <div className="mt-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Estimasi Angsuran</h4>
            
            <div className="flex justify-between items-center mb-2 text-sm text-gray-600">
              <span>Uang Muka ({dpPercent}%)</span>
              <span className="font-medium">{formatRupiah(result.dpAmount)}</span>
            </div>
            
            <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
              <span>Pokok Pembiayaan</span>
              <span className="font-medium">{formatRupiah(result.principal)}</span>
            </div>

            <div className="border-t border-dashed border-gray-300 pt-3">
              <div className="flex justify-between items-end">
                <span className="text-gray-800 font-medium">Cicilan per Bulan</span>
                <span className="text-2xl font-bold text-amber-600">
                  {formatRupiah(result.monthlyInstallment)}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-right">
                *Estimasi margin setara {margin}% p.a (Flat). Syarat & ketentuan berlaku.
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full py-3 mt-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          >
            Tutup Simulasi
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalculatorModal;