import api from '@/lib/api'

export interface LoginResponse {
  token: string
  username: string
  fullName: string
  role: string
}

export const authService = {
  login: (username: string, password: string) =>
    api.post<LoginResponse>('/api/auth/login', { username, password }).then(r => r.data),
}
