import { api } from '@/services/api'

export class UserService {
  register(data: {
    name: string
    email: string
    password: string
  }) {
    return api.post('/users', data)
  }

  login(data: {
    email: string
    password: string
  }) {
    return api.post('/sessions', data)
  }

  logout() {
    return api.delete('/sessions')
  }

  getProfile() {
    return api.get('/me')
  }

  refreshToken() {
    return api.patch('/token/refresh')
  }
}

export const userService = new UserService()
