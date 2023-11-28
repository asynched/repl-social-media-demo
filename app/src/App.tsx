import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import { Private } from '@/auth/Private'

import SignIn from '@/pages'
import SignUp from '@/pages/sign-up'
import App from '@/pages/app'
import Post from '@/pages/app/posts/[id]'
import { Public } from './auth/Public'

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Public>
        <SignIn />
      </Public>
    ),
  },
  {
    path: '/sign-up',
    element: (
      <Public>
        <SignUp />
      </Public>
    ),
  },
  {
    path: '/app',
    element: (
      <Private>
        <App />
      </Private>
    ),
  },
  {
    path: '/app/posts/:id',
    element: (
      <Private>
        <Post />
      </Private>
    ),
  },
])

export default function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
