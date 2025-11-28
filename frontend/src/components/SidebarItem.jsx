import React from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../context/cn'

const SidebarItem = ({
  icon: Icon,
  label,
  active = false,
  isCollapsed,
  slug = '#',
  onClick, // Added to handle logout clicks
}) => {
  return (
    <Link
      to={slug}
      onClick={onClick}
      className={cn(
        'group flex items-center rounded px-4 py-2 text-sm transition',
        active
          ? 'bg-indigo-50 text-indigo-600' // Changed text color for better contrast
          : 'text-gray-500 hover:bg-gray-100 hover:text-indigo-600',
      )}
    >
      <Icon
        className={cn(
          'size-4 flex-shrink-0 transition-colors',
          active ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600',
        )}
      />
      <span
        className={cn(
          'ml-4 font-medium transition-opacity duration-200',
          isCollapsed && 'hidden opacity-0',
        )}
      >
        {label}
      </span>
    </Link>
  )
}

export default SidebarItem