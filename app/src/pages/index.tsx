import { useForm } from '@/hooks/useForm'
import { client } from '@/services/http'
import { authStore } from '@/stores/auth'
import { User } from '@/types/domain'
import { Link, useNavigate } from 'react-router-dom'

type TokenResponse = {
  token: string
}

export default function SignIn() {
  const navigate = useNavigate()

  const [status, dispatch] = useForm(async (form) => {
    const { data: token } = await client.post<TokenResponse>('/auth/sign-in', {
      email: form.get('email'),
      password: form.get('password'),
    })

    client.defaults.headers.Authorization = `Bearer ${token.token}`

    const { data: user } = await client.get<User>('/auth/profile')

    localStorage.setItem('@user', JSON.stringify(user))
    localStorage.setItem('@token', token.token)

    authStore.next({ user, token: token.token })

    navigate('/app')
  })

  return (
    <div className="w-full h-screen grid place-items-center">
      <div className="p-8 border rounded">
        <h1 className="mb-4 text-4xl font-bold tracking-tighter text-center">
          Sign in
        </h1>
        <form className="mb-4 grid gap-4" onSubmit={dispatch}>
          <div className="flex flex-col gap-1">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              className="py-2 px-4 border rounded outline-none"
              placeholder="Your e-mail"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="py-2 px-4 border rounded outline-none"
              placeholder="Your e-mail"
            />
          </div>
          <button
            disabled={status.loading}
            type="submit"
            className="py-2 bg-blue-600 text-white rounded disabled:bg-blue-400"
          >
            Sign in
          </button>
        </form>
        <p className="text-center">
          Don't have an account?{' '}
          <Link to="/sign-up" className="underline text-blue-600">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
