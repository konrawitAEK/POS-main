import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthUser { username: string; fullName: string; role: string }
interface AuthState {
  token: string | null
  user:  AuthUser | null
  login:  (token: string, user: AuthUser) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null, user: null,
      login:  (token, user) => set({ token, user }),
      logout: () => { localStorage.removeItem('token'); set({ token: null, user: null }) },
    }),
    { name: 'pos-auth' }
  )
)
