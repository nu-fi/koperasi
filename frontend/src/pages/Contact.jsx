import { Mail, Phone } from 'lucide-react'
import { useEffect, useState } from 'react'

const Contact = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    subject: '',
    message: '',
  })

  // Removed TypeScript generic <...>
  const [status, setStatus] = useState(null)
  const [isPending, setIsPending] = useState(false)

  // Removed TypeScript type annotation (e: ...)
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Removed TypeScript type annotation
  const handleSubmit = (e) => {
    e.preventDefault()
    setStatus(null)
    setIsPending(true)

    if (!formData.fullname || !formData.email || !formData.message) {
      setStatus({ success: false, message: 'Please fill in all required fields.' })
      setIsPending(false)
      return
    }

    setStatus({ success: false, message: 'Submitting your form...' })

    // Simulate API call
    setTimeout(() => {
      setStatus({ success: true, message: 'Message sent successfully!' })
      setIsPending(false)
    }, 2000)
  }

  useEffect(() => {
    if (status?.success) {
      setFormData({ fullname: '', email: '', subject: '', message: '' })
    }
  }, [status?.success])

  return (
    <section
      id="kontak" // Ensure this ID matches your Navbar link (#kontak)
      className="scroll-mt-16 mx-auto grid max-w-6xl grid-cols-1 gap-16 bg-slate-50 p-8 md:grid-cols-2 md:gap-8 lg:gap-12"
    >
      {/* LEFT SIDE */}
      <div className="flex flex-col justify-between gap-8">
        <div>
          <h3 className="text-3xl font-bold text-slate-800">Let's Talk</h3>
          <h4 className="text-2xl font-bold text-indigo-600 md:text-3xl">We'd love to help</h4>
          <p className="mt-8 text-slate-600">
            Crafting innovative solutions to solve real-world problems.
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-lg font-bold text-slate-800">Contact Information</p>

          <a
            href="mailto:johndoe@gmail.com"
            className="flex items-center gap-1 text-sm font-medium text-gray-500 transition-colors duration-300 hover:text-indigo-600"
          >
            <Mail size={18} className="text-indigo-500" />
            johndoe@gmail.com
          </a>

          <a
            href="tel:+92 3123456789"
            className="flex items-center gap-1 text-sm font-medium text-gray-500 transition-colors duration-300 hover:text-indigo-600"
          >
            <Phone size={18} className="text-indigo-500" />
            +92 3123456789
          </a>
        </div>
      </div>

      {/* RIGHT SIDE FORM */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        {status?.success ? (
          <div className="h-full flex items-center justify-center">
             <p className="text-center text-2xl font-medium text-green-600">
                {status.message}
             </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#344054]">Full name</label>
              <input
                type="text"
                name="fullname"
                placeholder="Your name here"
                value={formData.fullname}
                onChange={handleChange}
                className="w-full rounded-lg border border-[#D0D5DD] px-4 py-2.5 text-gray-700 placeholder:text-[#667085] focus:border-blue-200 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#344054]">Email address</label>
              <input
                type="email"
                name="email"
                placeholder="Your email address here"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-[#D0D5DD] px-4 py-2.5 text-gray-700 placeholder:text-[#667085] focus:border-blue-200 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#344054]">Subject</label>
              <input
                type="text"
                name="subject"
                placeholder="Your subject here"
                value={formData.subject}
                onChange={handleChange}
                className="w-full rounded-lg border border-[#D0D5DD] px-4 py-2.5 text-gray-700 placeholder:text-[#667085] focus:border-blue-200 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />
            </div>

            {/* Message */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#344054]">Message</label>
              <textarea
                name="message"
                placeholder="Your message here"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="w-full rounded-lg border border-[#D0D5DD] px-4 py-2.5 text-gray-700 placeholder:text-[#667085] focus:border-blue-200 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />
            </div>

            {/* Error / Status */}
            {!status?.success && status?.message && (
              <p className="my-2 text-sm font-medium text-amber-600">{status.message}</p>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={isPending}
              className="mt-3 w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {isPending ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

export default Contact