'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

const ROLE_ROUTES: Record<string, string> = {
  admin: '/dashboard',
  cashier: '/pos',
}

export default function LoginPage() {
  const router = useRouter()
  const { token, user, login } = useAuthStore()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)

  useEffect(() => {
    if (token) {
      router.replace(ROLE_ROUTES[user?.role ?? ''] ?? '/dashboard')
    }
  }, [token, user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await authService.login(username, password)
      localStorage.setItem('token', data.token)
      login(data.token, { username: data.username, fullName: data.fullName, role: data.role })
      toast.success(`ยินดีต้อนรับ ${data.fullName}`)
      router.push(ROLE_ROUTES[data.role] ?? '/dashboard')
    } catch {
      toast.error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="card w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🏪</div>
          <h1 className="text-2xl font-bold">POS System</h1>
          <p className="text-gray-500 text-sm mt-1">ระบบขายหน้าร้าน</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อผู้ใช้</label>
            <input className="input" value={username} onChange={e => setUsername(e.target.value)} placeholder="username" required autoFocus />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน</label>
            <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="password" required />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-6">ทดสอบ: admin / admin123</p>
      </div>
    </div>
  )
}
