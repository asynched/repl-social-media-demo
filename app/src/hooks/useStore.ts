import { useEffect, useState } from 'react'

export type Subscriber<T> = (state: T) => void

export type Store<T> = {
  state: T
  subscribe: (subscriber: Subscriber<T>) => () => void
  next: (state: T) => void
}

export function createStore<T>(initialState: T): Store<T> {
  let state = initialState
  const subscribers = new Set<Subscriber<T>>()

  return {
    get state() {
      return state
    },
    subscribe(subscriber) {
      subscribers.add(subscriber)

      return () => {
        subscribers.delete(subscriber)
      }
    },
    next(newState) {
      state = newState
      subscribers.forEach((s) => s(state))
    },
  }
}

export function useStore<T>(store: Store<T>): T {
  const [state, setState] = useState(store.state)

  useEffect(() => {
    return store.subscribe(setState)
  }, [store])

  return state
}
