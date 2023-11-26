import { useEffect, useState } from 'react'

export default function useAsync<T>(promise: Promise<T>): {
  data: T | null
  loading: boolean
  error: unknown
}

export default function useAsync<T>(
  promise: Promise<T>,
  initial: T,
): { data: T; loading: boolean; error: unknown }

export default function useAsync<T>(promise: Promise<T>, initial?: T) {
  const [data, setData] = useState<T | null>(initial ?? null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)

  useEffect(() => {
    promise
      .then((data) => {
        setData(data)
        setLoading(false)
      })
      .catch((error) => {
        setError(error)
        setLoading(false)
      })
  }, [promise])

  return { data, loading, error }
}
