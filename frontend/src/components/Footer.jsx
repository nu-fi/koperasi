'use client'
import { ArrowUp, Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react'

const socialLinks = [
  {
    name: 'Facebook',
    link: '/',
    icon: <Facebook color="#FB991C" size={16} />,
  },
  {
    name: 'Instagram',
    link: '/',
    icon: <Instagram color="#FB991C" size={16} />,
  },
]

const pageLinks = {
  title: 'Useful links',
  items: [
    { label: 'Home', href: '' },
    { label: 'Abouts', href: '' },
    { label: 'Products', href: '' },
    { label: 'Contact us', href: '' },
  ],
}

const contactInfo = [
  {
    label: 'Phone',
    icon: <Phone strokeWidth={3} stroke="#FB991C" size={17} />,
    value: '+(012) 345 6789',
  },
  {
    label: 'Email',
    icon: <Mail strokeWidth={3} stroke="#FB991C" size={17} />,
    value: 'abcdxyz@gmail.com',
  },
  {
    label: 'Address',
    icon: <MapPin strokeWidth={3} stroke="#FB991C" size={17} />,
    value: '2548 Maple Court Avenue, Madisonville KY 4783',
  },
]

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer>
      <div className="mx-auto max-w-7xl overflow-hidden px-4">
        <div className="grid grid-cols-1 place-items-center gap-5 py-6 sm:grid-cols-2 sm:place-items-start sm:gap-10 md:grid-cols-[35fr_25fr_30fr] md:py-8 lg:gap-12 lg:py-16">
          <div>
            {contactInfo.map(({ label, icon, value }) => (
              <div
                key={label}
                className="mb-6 flex flex-col items-center justify-center gap-2 pl-0 text-center sm:items-start sm:justify-start sm:gap-0 sm:text-left md:border-l-3 md:border-[#E2E2E2] md:pl-4 lg:pl-5"
              >
                <div className="flex items-center gap-4">
                  <div>{icon}</div>
                  <h3 className="text-lg font-medium text-[#FB991C] sm:text-base">{label}</h3>
                </div>
                <p className="ml-0 leading-6 font-normal whitespace-pre-line text-black sm:ml-8 lg:leading-7">
                  {value}
                </p>
              </div>
            ))}
          </div>
          <div className="relative sm:hidden">
            <div className="absolute left-1/2 w-screen -translate-x-1/2 border border-[#E2E2E2]"></div>
          </div>
          <div className="hidden sm:block">
            <h6 className="mb-6 text-base leading-none text-[#FB991C] md:mb-8 lg:mb-7 lg:text-lg">
              {pageLinks.title}
            </h6>
            <ul className="ml-4 list-disc lg:ml-5">
              {pageLinks.items.map(({ label, href }) => (
                <li
                  key={label}
                  className="text-sm leading-11 font-normal text-black marker:text-[#FB991C] hover:underline hover:decoration-[#FB991C] hover:underline-offset-8"
                >
                  <a href="javascript:void(0)">{label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 mb-2 text-center sm:mt-0 sm:mb-0 sm:text-left">
            <a
              href="javascript:void(0)"
              className="mb-8 flex items-center justify-center gap-4 text-white sm:items-start sm:justify-start md:mb-5 lg:mb-8"
            >
              <img
                src="https://res.cloudinary.com/dyvkdwzcj/image/upload/v1709055594/logo-1_vo1dni.png"
                className="h-10"
                alt="Logo"
              />
              <h6 className="text-4xl font-semibold text-[#1C7690] lg:text-4xl">Best Tech</h6>
            </a>
            <p className="mb-6 px-4 text-xs leading-5 font-normal text-[#575757] sm:px-0">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
              has been the industry's standard dummy text ever since the 1500s, when an unknown
              printer took a galley of type and scrambled it to make a type specimen book.
            </p>
            <a
              href="javascript:void(0)"
              className="text-base leading-6 font-semibold text-[#FB991C] lg:leading-11"
            >
              Read More
            </a>
          </div>
        </div>
      </div>
      <div className="relative">
        <button
          onClick={scrollToTop}
          className="absolute top-5 right-4 hidden size-9 cursor-pointer items-center justify-center rounded-full bg-[#FB991C] sm:flex md:-top-14 md:right-4 md:size-12 2xl:top-5"
        >
          <ArrowUp color="#fff" size={22} />
        </button>
        <div className="absolute right-0 left-0 mx-auto w-full max-w-screen-2xl border-1 border-t border-[#E2E2E2]"></div>
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-6 md:flex-row md:justify-between">
          <p className="text-center text-black">
            © 2025 <span className="font-normal text-[#1C7690]">BestTech</span>, All rights
            reserved.
          </p>
          <ul className="hidden items-center gap-6 sm:flex">
            {socialLinks.map(({ name, icon, link }) => (
              <li className="rounded-full bg-[#FBFBFB] p-3" key={name}>
                <a
                  href="javascript:void(0)"
                  title={name}
                  className="bg-black"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {icon}
                </a>
                <span className="sr-only">{name} account</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default Footer