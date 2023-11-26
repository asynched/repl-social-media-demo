import { useForm } from '@/hooks/useForm'
import { client } from '@/services/http'
import { Link, useNavigate } from 'react-router-dom'

export default function SignUp() {
  const navigate = useNavigate()

  const [status, dispatch] = useForm(async (form) => {
    await client.post('/auth/sign-up', {
      name: form.get('name'),
      email: form.get('email'),
      password: form.get('password'),
    })

    navigate('/')
  })

  return (
    <div className="w-full h-screen grid place-items-center">
      <div className="p-8 border rounded">
        <h1 className="text-4xl font-bold tracking-tighter text-center">
          Sign up
        </h1>
        <form className="mb-4 grid gap-4" onSubmit={dispatch}>
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="py-2 px-4 border rounded outline-none"
              placeholder="Your name"
            />
          </div>
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
              placeholder="Your password"
            />
          </div>
          <button
            disabled={status.loading}
            type="submit"
            className="py-2 bg-blue-600 text-white rounded disabled:bg-blue-400"
          >
            Sign up
          </button>
        </form>
        <p className="text-center">
          Already have an account?{' '}
          <Link to="/" className="text-blue-600 underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
