'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import clsx from 'clsx'
import { FiHome, FiShoppingCart, FiPackage, FiGrid, FiBarChart2, FiLogOut, FiList } from 'react-icons/fi'

const nav = [
  { href: '/dashboard',  label: 'ภาพรวม',    icon: FiHome },
  { href: '/pos',        label: 'ขายสินค้า', icon: FiShoppingCart },
  { href: '/products',   label: 'สินค้า',    icon: FiPackage },
  { href: '/categories', label: 'หมวดหมู่',  icon: FiGrid },
  { href: '/stock',      label: 'สต็อก',     icon: FiBarChart2 },
  { href: '/orders',     label: 'บิลขาย',    icon: FiList },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router   = useRouter()
  const { user, logout } = useAuthStore()

  return (
    <aside className="w-60 min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <div className="text-xl font-bold">🏪 POS System</div>
        <div className="text-xs text-gray-400 mt-1">{user?.fullName}</div>
        <div className="text-xs text-blue-400">{user?.role}</div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}
            className={clsx('flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              pathname === href ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800')}>
            <Icon size={18} />{label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <button onClick={() => { logout(); router.push('/login') }}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-800 w-full">
          <FiLogOut size={18} />ออกจากระบบ
        </button>
      </div>
    </aside>
  )
}
