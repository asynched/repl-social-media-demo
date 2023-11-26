import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useStore } from '@/hooks/useStore'
import { authStore } from '@/stores/auth'
import { client } from '@/services/http'
import { useForm } from '@/hooks/useForm'
import { Link, useNavigate } from 'react-router-dom'
import { Post } from '@/types/domain'
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'
import { timeSince } from '@/utils/time'

export default function App() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useStore(authStore)

  const [status, dispatch] = useForm(async (form) => {
    await client.post('/posts', {
      content: form.get('content'),
    })

    queryClient.invalidateQueries({
      queryKey: ['posts'],
    })
  })

  const { data: posts } = useQuery({
    queryKey: ['posts'],
    queryFn: () =>
      client
        .get<(Post & { user: { name: string } })[]>('/posts')
        .then((r) => r.data),
    initialData: [],
  })

  const handleSignOut = () => {
    localStorage.removeItem('@user')
    localStorage.removeItem('@token')
    authStore.next({ user: null, token: null })
    navigate('/')
  }

  return (
    <div className="py-8 max-w-screen-sm mx-auto">
      <h1 className="mb-4 text-4xl font-bold tracking-tighter">
        Hello, {user?.name}!
      </h1>
      <button
        className="fixed bottom-8 right-8 w-12 h-12 bg-red-600 grid place-items-center rounded text-white"
        aria-label="Sign out"
        title="Sign out"
        onClick={handleSignOut}
      >
        <ArrowLeftOnRectangleIcon className="w-6 h-6" />
      </button>
      <form className="mb-4 w-full flex flex-col gap-2" onSubmit={dispatch}>
        <textarea
          id="content"
          name="content"
          className="appearance-none border rounded py-2 px-4 outline-none resize-none"
          placeholder="What's on your mind?"
        />
        <button
          disabled={status.loading}
          className="py-2 px-8 bg-blue-600 text-white rounded place-self-end text-sm"
        >
          Post
        </button>
      </form>
      <ul className="grid gap-4">
        {posts.map((post) => (
          <li className="p-4 border rounded" key={post.id}>
            <Link to={`/app/posts/${post.id}`}>{post.content}</Link>
            <p className="text-sm text-gray-600">
              {post.user.name} - {timeSince(post.createdAt)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
