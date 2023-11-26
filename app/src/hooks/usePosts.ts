import { client } from '@/services/http'
import { REPLClient } from '@/services/repl'
import { Post } from '@/types/domain'
import { useEffect, useState } from 'react'

export function usePosts(repl: REPLClient) {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    return repl.subscribe('posts', (message) => {
      const { type, data } = JSON.parse(message.value)

      if (type === 'create') {
        setPosts((posts) => [data, ...posts])
      }
    })
  }, [repl])

  useEffect(() => {
    client.get<Post[]>('/posts').then((r) => setPosts(r.data))
  }, [setPosts])

  return [posts, setPosts] as const
}
