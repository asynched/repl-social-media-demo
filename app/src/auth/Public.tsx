import { useStore } from '@/hooks/useStore'
import { authStore } from '@/stores/auth'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

type PublicProps = {
  children: React.ReactNode
}

export function Public({ children }: PublicProps) {
  const auth = useStore(authStore)
  const navigate = useNavigate()

  useEffect(() => {
    if (auth.user) {
      console.log('redirecting')
      navigate('/')
    }
  }, [auth, navigate])

  if (auth.user) {
    return null
  }

  return <>{children}</>
}
