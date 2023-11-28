import axios from 'axios'

export const client = axios.create({
  baseURL: import.meta.env.VITE_ENV_API_URL,
})

if (localStorage.getItem('@token')) {
  const token = localStorage.getItem('@token')!

  client.defaults.headers.common['Authorization'] = `Bearer ${token}`
}
