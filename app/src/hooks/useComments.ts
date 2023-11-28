import { client } from "@/services/http";
import { REPLClient } from "@/services/repl";
import { Comment } from "@/types/domain";
import { useEffect, useState } from "react";

export function useComments(repl: REPLClient, postId: number) {
  const [comments, setComments] = useState<Comment[]>([])

  useEffect(() => {
    return repl.subscribe(`comments:${postId}`, (message) => {
      const { type, data } = JSON.parse(message.value)

      if (type === 'create') {
        setComments((comments) => [data, ...comments])
      }
    })
  }, [postId, repl])

  useEffect(() => {
    client.get<Comment[]>(`/posts/${postId}/comments`).then((r) => setComments(r.data))
  }, [setComments, postId])

  return [comments, setComments] as const
}