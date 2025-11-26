import { LogInIcon, MenuIcon, XIcon, Origami } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom';

const navLinks = [
  { title: 'Produk dan Layanan', link: '#produk' },
  { title: 'Tentang Kami', link: '#tentang' },
  { title: 'Hubungi Kami', link: '#kontak' },
]

const Navbar = () => {
  const [showNav, setShowNav] = useState(false)

  const handleShowNav = () => {
    setShowNav(!showNav)
  }

  return (
    <nav className="sticky top-0 z-50 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between bg-white px-2 py-2 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 sm:gap-10">
          {/* hamburger menu or cross icon */}
          <button onClick={handleShowNav} aria-label="Toggle Menu" className="md:hidden">
            {showNav ? (
              <XIcon color="#202020" strokeWidth={3} size={25} />
            ) : (
              <MenuIcon color="#202020" strokeWidth={3} size={25} />
            )}
          </button>
          {/* logo */}
          <a href="/" className="flex items-center gap-3">
            <Origami color='#202020' strokeWidth={3} size={25} className='h-8' />
          
            <span className="self-center text-xl font-semibold whitespace-nowrap text-stone-900 md:text-2xl">
              Koperasi Syariah
            </span>
          </a>
          {/* nav links */}
          <div
            className={`absolute right-0 left-0 -z-10 flex w-full flex-col gap-3 bg-white p-3 shadow transition-all duration-300 ease-in-out md:relative md:top-auto md:right-auto md:left-0 md:z-auto md:flex-row md:shadow-none ${showNav ? 'top-[54px]' : 'top-[-165px]'}`}
          >
            {navLinks.map(({ title, link }, index) => (
              <a
                key={index}
                href={link}
                onClick={() => setShowNav(false)}
                className="rounded-md px-3 py-2 text-slate-500 transition-colors duration-100 ease-linear hover:bg-gray-700 hover:text-white"
              >
                {title}
              </a>
            ))}
          </div>
        </div>
        {/* CTA button */}
        {/* <div>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border bg-amber-500 px-3.5 py-1.5 text-base font-semibold text-white transition duration-300 ease-in-out hover:bg-amber-600 active:scale-95 sm:px-5 sm:py-2"
          >
            <LogInIcon strokeWidth={3} size={18} />
            <span>Login</span>
          </button>
        </div> */}
        <div>
          {/* Change button to Link and add the 'to' prop */}
          <Link
            to="/login"
            className="flex items-center gap-2 rounded-lg border bg-amber-500 px-3.5 py-1.5 text-base font-semibold text-white transition duration-300 ease-in-out hover:bg-amber-600 active:scale-95 sm:px-5 sm:py-2"
          >
            <LogInIcon strokeWidth={3} size={18} />
            <span>Login</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}


export default Navbar