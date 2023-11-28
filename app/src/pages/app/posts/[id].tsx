import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { client } from '@/services/http'
import { useForm } from '@/hooks/useForm'
import type { Post } from '@/types/domain'
import { timeSince } from '@/utils/time'
import { useComments } from '@/hooks/useComments'
import { repl } from '@/services/repl'
import { useMemo } from 'react'

export default function Post() {
  const params = useParams()
  const postId = useMemo(() => Number(params.id), [params.id])

  const [status, dispatch] = useForm(async (form) => {
    await client.post(`/posts/${params.id}/comments`, {
      content: form.get('content'),
    })
  })

  const { data: post } = useQuery({
    queryKey: ['posts', postId],
    queryFn: () => client.get<Post>(`/posts/${params.id}`).then((r) => r.data),
  })

  const [comments] = useComments(repl, postId)

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
