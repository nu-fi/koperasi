import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ChevronLeft, CircleUser, LayoutDashboard, LogOut, Settings, HandCoins, Wallet, FileClock } from 'lucide-react' // Added FileClock icon
import { cn } from '../context/cn.js'
import SidebarItem from "./SidebarItem"
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const STATUS_API_URL = (import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000') + '/loans/status/';

const CollapsibleSidebar = ({ className }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { name, logoutAction } = useAuth();
  const [loanStatus, setLoanStatus] = useState(null);

  // User data structure
  const user = {
    name: name || "User",
    avatar: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=32&h=32&fit=crop&crop=face"
  }

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev)
  }

  const handleLogout = () => {
    navigate('/');
    setTimeout(() => {
        logoutAction();
        toast.success("Logged out successfully");
    }, 0);
  }

  useEffect(() => {
    const checkActiveLoan = async () => {
      const token = localStorage.getItem('access');
      if (!token) return;

      try {
        const response = await axios.get(STATUS_API_URL, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        // Simpan status spesifik dari backend ('pending', 'disbursed', dll)
        if (response.data) {
            setLoanStatus(response.data.status);
        }

      } catch (error) {
        console.error("Sidebar check failed:", error);
      }
    };

    checkActiveLoan();
  }, []);

  let dynamicMenu = null;

  if (loanStatus === 'disbursed') {
    // KONDISI 1: Uang sudah cair -> Tampilkan Menu Angsuran
    dynamicMenu = { 
        icon: Wallet, 
        label: 'Info Angsuran', 
        slug: '/repayment' // Halaman tabel cicilan
    };
  } else if (loanStatus === 'pending' || loanStatus === 'approved') {
    // KONDISI 2: Masih proses -> Tampilkan Timeline
    dynamicMenu = { 
        icon: FileClock, 
        label: 'Status Pengajuan', 
        slug: '/loan-progress' // Halaman timeline
    };
  } else {
    // KONDISI 3: Belum ada / Ditolak / Lunas -> Tampilkan Form Ajukan
    dynamicMenu = { 
        icon: HandCoins, 
        label: 'Ajukan Pembiayaan', 
        slug: '/apply-loan' 
    };
  }

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', slug: '/dashboard' },
    { icon: CircleUser, label: 'Profil', slug: '/profile' },
    // Masukkan menu dinamis tadi
    dynamicMenu 
  ]

  const userActions = [
    { icon: Settings, label: 'Settings', slug: '/settings' },
  ]

  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r border-r-[#EBEDEE] bg-[#F5F7F9] transition-all duration-300',
        isCollapsed ? 'w-20' : 'w-60',
        className,
      )}
    >
      {/* Header */}
      <div className="relative border-b border-b-[#EBEDEE] px-4 py-3">
        <div className="flex items-center space-x-3">
          <img
            src="https://plus.unsplash.com/premium_photo-1661962960694-0b4ed303744f?q=80&w=1935&auto=format&fit=crop"
            alt="App Logo"
            className="size-6 rounded-full object-cover"
          />
          <span
            className={cn(
              'text-lg font-bold text-gray-800 transition-opacity duration-200 whitespace-nowrap',
              isCollapsed && 'hidden opacity-0',
            )}
          >
            Koperasi Syariah
          </span>
        </div>
        <button
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
          className="absolute top-4 -right-3 cursor-pointer rounded-full border border-[#EBEDEE] bg-white p-1 text-gray-600 hover:bg-[#EBEDEE] shadow-sm"
        >
          <ChevronLeft
            className={cn('h-4 w-4 transition-transform duration-200', isCollapsed && 'rotate-180')}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-2 flex-1 overflow-y-auto">
        <ul className="space-y-2 px-2">
          {menuItems.map((item, idx) => (
            <li key={idx}>
              <SidebarItem 
                {...item} 
                isCollapsed={isCollapsed} 
                active={location.pathname === item.slug}
              />
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer/User Section */}
      <div className="mt-auto border-t border-t-[#EBEDEE]">
        {/* User Profile */}
        <div className="flex cursor-pointer items-center px-4 py-3 transition hover:bg-gray-100 overflow-hidden">
          <img
            src={user.avatar}
            alt={user.name}
            className="size-8 rounded-full"
          />
          <div
            className={cn(
              'ml-3 flex flex-col transition-opacity duration-200 whitespace-nowrap',
              isCollapsed && 'hidden opacity-0',
            )}
          >
            <span className="text-sm font-medium text-gray-700">{user.name}</span>
          </div>
        </div>

        {/* User Actions */}
        <div className="px-2 pb-2">
          {userActions.map((item, idx) => (
            <SidebarItem 
              key={idx} 
              {...item} 
              isCollapsed={isCollapsed}
              active={location.pathname === item.slug}
            />
          ))}
          
          {/* Logout Button */}
          <button 
            onClick={handleLogout} 
            className="w-full text-left"
          >
            <div className={cn(
                'group flex items-center rounded px-4 py-2 text-sm transition text-gray-500 hover:bg-red-50 hover:text-red-600',
              )}>
              <LogOut className="size-4 flex-shrink-0 transition-colors text-gray-400 group-hover:text-red-600" />
              <span
                className={cn(
                  'ml-4 font-medium transition-opacity duration-200',
                  isCollapsed && 'hidden opacity-0',
                )}
              >
                Logout
              </span>
            </div>
          </button>
        </div>

        {/* Footer Text */}
        <div className="border-t border-t-[#EBEDEE] px-4 py-3 overflow-hidden">
          <span
            className={cn(
              'text-xs text-gray-400 transition-opacity duration-200 whitespace-nowrap',
              isCollapsed && 'hidden opacity-0',
            )}
          >
            © 2025 Flexy UI
          </span>
        </div>
      </div>
    </aside>
  )
}

export default CollapsibleSidebar