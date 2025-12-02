import { Flag, Globe, GlobeIcon } from 'lucide-react'

const title = 'Build Your Brand with Our Digital Agency'

const description =
  'We create modern websites, smart marketing campaigns, and eye-catching designs to help your business grow.'

const Home = () => {
  return (
    <section className="w-full rounded-3xl bg-[#F1F0FB] px-4 py-16">
      <div className="mx-auto max-w-4xl text-center">
        
        {/* Badge Section */}
        <div className="animate-pulse-light mb-3 inline-flex items-center rounded-full bg-white/80 px-4 py-1.5 text-sm font-medium text-[#E07A5F]">
          <span className="mr-2 rounded-full bg-[#E07A5F] px-2 py-0.5 text-xs text-white">
            Baru
          </span>
          Aplikasi Mobile Koperasi kini tersedia!
        </div>

        {/* Title Section */}
        <h1 className="mb-4 text-4xl leading-snug font-bold text-[#2F4550] md:text-5xl md:leading-snug lg:text-6xl lg:leading-snug">
          Keuangan Syariah Modern untuk <span className="text-[#E07A5F]">Masa Depan Berkah</span>
        </h1>

        {/* Description Section */}
        <p className="mx-auto mb-8 max-w-3xl text-lg text-[#2F4550]/80 md:text-xl">
          Tinggalkan keraguan, beralihlah ke solusi keuangan yang 100% bebas riba. 
          Kami hadir membantu Anda mengelola tabungan dan pembiayaan dengan akad 
          yang transparan, adil, dan menentramkan hati.
        </p>

        {/* Buttons Section */}
        <div className="mb-8 flex flex-col justify-center gap-4 px-5 sm:flex-row">
          {/* Button 1: Primary Action */}
          <a
            href="#produk"
            className="flex items-center justify-center rounded-full bg-[#FDE1D3] px-6 py-2 font-semibold text-[#2F4550] hover:bg-[#FDE1D3]/90 transition-colors"
          >
            <Flag className="mr-2" size={18} />
            Lihat Produk Syariah
          </a>

          {/* Button 2: Secondary Action (Misal ke Simulasi atau Kontak) */}
          <a
            href="#simulasi"
            className="flex items-center justify-center rounded-full bg-[#D3E4FD] px-6 py-2 font-semibold text-[#2F4550] hover:bg-[#D3E4FD]/90 transition-colors"
          >
            <Globe className="mr-2" size={18} /> {/* Bisa diganti icon Calculator */}
            Simulasi Pembiayaan
          </a>
        </div>

        {/* Trust Badge Section */}
        <div className="mt-6 flex items-center justify-center">
          <div className="flex items-center space-x-2 rounded-full bg-white/70 px-4 py-2 backdrop-blur-sm shadow-sm">
            <GlobeIcon color="#3D8690" size="18" />
            <span className="text-sm font-medium text-[#2F4550]">
              Dipercaya oleh <strong>2.500+ Anggota</strong> Aktif
            </span>
          </div>
        </div>
        
      </div>
    </section>
  )
}

export default Home