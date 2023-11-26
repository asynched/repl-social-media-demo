type Record<T> = T & {
  id: number
  createdAt: string
  updatedAt: string
}

export type User = Record<{
  name: string
  email: string
}>

export type Post = Record<{
  content: string
  userId: number
  user: User
}>

export type Comment = Record<{
  content: string
  userId: number
  postId: number
  user: User
}>
