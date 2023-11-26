import { useParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { client } from '@/services/http'
import { useForm } from '@/hooks/useForm'
import type { Post, Comment } from '@/types/domain'
import { timeSince } from '@/utils/time'

export default function Post() {
  const params = useParams()
  const queryClient = useQueryClient()

  const [status, dispatch] = useForm(async (form) => {
    await client.post(`/posts/${params.id}/comments`, {
      content: form.get('content'),
    })

    queryClient.invalidateQueries({
      queryKey: ['posts', params.id, 'comments'],
    })
  })

  const { data: post } = useQuery({
    queryKey: ['posts', params.id],
    queryFn: () =>
      client
        .get<Post & { user: { name: string } }>(`/posts/${params.id}`)
        .then((r) => r.data),
  })

  const { data: comments } = useQuery({
    queryKey: ['posts', params.id, 'comments'],
    queryFn: () =>
      client
        .get<(Comment & { user: { name: string } })[]>(
          `/posts/${params.id}/comments`,
        )
        .then((r) => r.data),
    initialData: [],
  })

  if (!post) {
    return <div>Loading...</div>
  }

  return (
    <div className="py-8 max-w-screen-sm mx-auto">
      <h1 className="text-4xl font-bold tracking-tighter">Post</h1>
      <p className="text-xl">"{post.content}"</p>
      <p className="mb-4 text-sm text-gray-600">
        {post.user.name} - {timeSince(post.createdAt)}
      </p>
      <form className="mb-4 flex gap-2" onSubmit={dispatch}>
        <input
          type="text"
          id="content"
          name="content"
          className="py-2 px-4 border rounded flex-1 outline-none"
          placeholder="Leave a comment"
        />
        <button
          disabled={status.loading}
          type="submit"
          className="py-2 px-4 bg-blue-600 rounded text-white disabled:bg-blue-400"
        >
          Comment
        </button>
      </form>
      <ul className="mx-4 grid gap-4">
        {comments.map((comment) => (
          <li className="pb-4 border-b" key={comment.id}>
            <p>{comment.content}</p>
            <p className="text-sm text-gray-600">
              {comment.user.name} - {timeSince(comment.createdAt)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
