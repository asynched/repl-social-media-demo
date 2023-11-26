import { createStore } from '@/hooks/useStore'
import { User } from '@/types/domain'

const getUser = () => {
  const user = localStorage.getItem('@user')
  return user ? (JSON.parse(user) as User) : null
}

const getToken = () => {
  return localStorage.getItem('@token')
}

export const authStore = createStore({
  user: getUser(),
  token: getToken(),
})

console.log(authStore.state)
