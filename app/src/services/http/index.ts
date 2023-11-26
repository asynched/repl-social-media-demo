import axios from 'axios'

export const client = axios.create({
  baseURL: import.meta.env.VITE_ENV_BASE_URL,
})

if (localStorage.getItem('@token')) {
  const token = localStorage.getItem('@token')!

  client.defaults.headers.common['Authorization'] = `Bearer ${token}`
}
