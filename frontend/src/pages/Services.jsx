import { ShoppingCart, Calculator, House } from 'lucide-react';
import { useState } from 'react';
import CalculatorModal from '../components/CalculatorModal';

const Services = () => {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  return (
    <section
      id="produk"
      className="min-h-screen flex flex-col justify-center items-center bg-white p-10 text-center scroll-mt-16"
    >
      {/* Heading Section */}
      <div className="max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl font-bold text-amber-600 mb-4">
          Produk dan Layanan
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          Wujudkan rencana masa depan dengan solusi keuangan yang aman, 
          transparan, dan sesuai prinsip syariah. Bebas riba, penuh berkah.
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        
        {/* Product 1: Modal Usaha */}
        <div className="rounded-2xl border-blue-100 bg-slate-50 p-6  shadow-md hover:shadow-lg transition-shadow border flex flex-col items-center">
          <div className="p-3 bg-amber-100 rounded-full mb-4 text-amber-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Modal Usaha</h3>
          <p className="text-gray-500 text-sm">
            Kembangkan bisnismu dengan skema <strong>Mudharabah</strong> (Bagi Hasil). 
            Modal berkah, bisnis tumbuh, keuntungan dibagi secara adil.
          </p>
        </div>

        {/* Product 2: Pembelian Barang */}
        <div className="rounded-2xl border-blue-100 bg-slate-50 p-6  shadow-md hover:shadow-lg transition-shadow border flex flex-col items-center">
          <div className="p-3 bg-amber-100 rounded-full mb-4 text-amber-600">
            {/* Icon Placeholder (Misal: Shopping Cart/Car) */}
            <ShoppingCart size={24} />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Pembiayaan Barang</h3>
          <p className="text-gray-500 text-sm mb-6">
            Miliki kendaraan atau elektronik impian lewat akad <strong>Murabahah</strong> (Jual Beli). 
            Harga transparan, margin jelas, tanpa riba.
          </p>

          <button 
            className="w-full flex justify-center items-center gap-2 px-4 py-2 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-all duration-300"
            onClick={() => setIsCalculatorOpen(true)} // Ganti dengan fungsi navigasi/modal kamu
          >
            {/* Ikon Kalkulator */}
            <Calculator size={16} />
            Hitung Simulasi
          </button>
        </div>

        {/* Product 3: Multiguna/Jasa */}
        <div className="rounded-2xl border-blue-100 bg-slate-50 p-6  shadow-md hover:shadow-lg transition-shadow border flex flex-col items-center">
          <div className="p-3 bg-amber-100 rounded-full mb-4 text-amber-600">
            <House size={24} />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Renovasi & Jasa</h3>
          <p className="text-gray-500 text-sm">
            Solusi biaya renovasi rumah, pendidikan, atau kesehatan dengan akad <strong>Ijarah</strong>. 
            Manfaat jasa maksimal, pembayaran fleksibel.
          </p>
        </div>

      </div>
      {/* Calculator Modal */}
      <CalculatorModal 
      isOpen={isCalculatorOpen} 
      onClose={() => setIsCalculatorOpen(false)}
      productName="Pembiayaan Barang (Murabahah)"
       />
    </section>
  );
};

export default Services;