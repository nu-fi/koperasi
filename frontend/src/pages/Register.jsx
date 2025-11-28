import { useState, useEffect } from 'react';
import { LoaderCircle, Lock, Mail, UserRound, Origami } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { toast } from "react-toastify";
import { useAuth } from '../context/AuthContext';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL + "/user/register/";

function Register() {
  const { isLoggedIn, loginAction } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) navigate("/dashboard");
  }, [isLoggedIn, navigate]);

  const handleRegister = async (ev) => {
    ev.preventDefault();

    const name = ev.target.name.value;
    const email = ev.target.email.value;
    const password = ev.target.password.value;
    const confirmPassword = ev.target.confirmPassword.value;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const formData = {
      name: name,
      email: email,
      password: password,
    };

    setLoading(true);

    try {
      const response = await axios.post(BACKEND_URL, formData);
      const data = response.data;

      if (data.success === true) {
        toast.success("Registration successful!");
        loginAction({
          username: name,
          email: email,
          access: data.token,
          refresh: data.refreshToken
        });
        navigate("/dashboard");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  // const handleSubmit = (event) => {
  //   event.preventDefault();

  //   let newErrors = { name: '', email: '', password: '' };

  //   if (!user.name.trim()) newErrors.name = 'Please enter your name.';
  //   if (!user.email.trim()) newErrors.email = 'Please enter a valid email.';
  //   if (!user.password.trim()) newErrors.password = 'Password cannot be empty.';

  //   if (newErrors.name || newErrors.email || newErrors.password) {
  //     setErrors(newErrors);
  //     return;
  //   }

  //   setLoading(true);
  //   setTimeout(() => {
  //     setLoading(false);
  //     console.log('Signup successful:', user);
  //     alert('Signup successful!');
  //   }, 2000);
  // };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        {/* Logo */}
        <div className="mb-4 flex justify-center">
            <Origami color='#202020' strokeWidth={3} size={25} className='h-8' />
        </div>

        <h2 className="mb-8 text-center text-2xl font-semibold text-gray-800">
          Sign up to Koperasi Syariah
        </h2>

        <form onSubmit={handleRegister}>
          {/* Full Name */}
          <div className="mb-6">
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-gray-500">
                <UserRound size={20} />
              </span>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                required                
                className={`w-full rounded-lg border px-4 py-2.5 pl-10 focus:ring-2 focus:ring-blue-200 outline-none transition-all
                }`}
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-6">
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-gray-500">
                <Mail size={20} />
              </span>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                className={`w-full rounded-lg border px-4 py-2.5 pl-10 focus:ring-2 focus:ring-blue-200 outline-none transition-all`}
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-6">
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-gray-500">
                <Lock size={20} />
              </span>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                required
                className={`w-full rounded-lg border px-4 py-2.5 pl-10 focus:ring-2 focus:ring-blue-200 outline-none transition-all `}
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-gray-500">
                <Lock size={20} />
              </span>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                required
                className={`w-full rounded-lg border px-4 py-2.5 pl-10 focus:ring-2 focus:ring-blue-200 outline-none transition-all `}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex h-10 w-full items-center justify-center rounded-lg bg-neutral-800 text-white hover:bg-neutral-700 disabled:bg-gray-300 transition duration-300"
          >
            {loading ? <LoaderCircle className="animate-spin" size={20} /> : 'Create an account'}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-600">Already have an account? </span>
          {/* Changed <a> to <Link> for React Router */}
          <Link to="/login" className="text-sm font-medium text-blue-600 hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;