import { useState } from 'react'

export function useForm<T>(handler: (data: FormData) => Promise<T>) {
  const [data, setData] = useState<T>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error>()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setLoading(true)

    const formData = new FormData(event.currentTarget)

    try {
      const data = await handler(formData)
      setData(data)
      ;(event.target as any)?.reset()
    } catch (error) {
      setError(error as Error)
    } finally {
      setLoading(false)
    }
  }

  return [
    {
      data,
      loading,
      error,
    },
    onSubmit,
  ] as const
}
