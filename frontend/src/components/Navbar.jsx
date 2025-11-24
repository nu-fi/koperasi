import { CircleFadingPlus, MenuIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

const navLinks = [
  { title: 'Tools', link: '#' },
  { title: 'Blog', link: '#' },
  { title: 'Contact', link: '#' },
  { title: 'About', link: '#' },
];

const Navbar = () => {
  const [showNav, setShowNav] = useState(false);

  const handleShowNav = () => {
    setShowNav(!showNav);
  };

  return (
    // 'sticky top-0' makes it stay at the top when scrolling
    <nav className=" relative z-50 w-full bg-white shadow-md"> 
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        
        {/* 1. Mobile Menu Button & Logo Group */}
        <div className="flex items-center gap-4">
          {/* Hamburger Menu (Mobile only) */}
          <button 
            onClick={handleShowNav} 
            aria-label="Toggle Menu" 
            className="md:hidden focus:outline-none"
          >
            {showNav ? (
              <XIcon className="text-stone-900" strokeWidth={2} size={28} />
            ) : (
              <MenuIcon className="text-stone-900" strokeWidth={2} size={28} />
            )}
          </button>

          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <img
              src="https://res.cloudinary.com/dyvkdwzcj/image/upload/v1709055594/logo-1_vo1dni.png"
              className="h-8 w-auto"
              alt="Logo"
            />
            <span className="text-xl font-bold text-stone-900 md:text-2xl">
              BestTech
            </span>
          </a>
        </div>

        {/* 2. Navigation Links */}
        <div
          className={`absolute left-0 right-0 w-full bg-white p-4 shadow-lg transition-all duration-300 ease-in-out md:static md:block md:w-auto md:bg-transparent md:p-0 md:shadow-none ${
            showNav ? 'top-16 opacity-100' : 'top-[-400px] opacity-0 md:opacity-100'
          }`}
        >
          <div className="flex flex-col gap-4 md:flex-row md:gap-8">
            {navLinks.map(({ title, link }, index) => (
              <a
                key={index}
                href={link}
                className="font-medium text-slate-600 hover:text-amber-500 transition-colors"
              >
                {title}
              </a>
            ))}
          </div>
        </div>

        {/* 3. CTA Button */}
        <div>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-amber-600 focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
          >
            <CircleFadingPlus size={18} />
            <span>Submit</span>
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;