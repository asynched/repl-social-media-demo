type REPLClientOptions = {
  mode: 'standalone'
  url: string
}

type REPLMessage = {
  id: string
  value: string
  headers: Record<string, string>
  createdAt: string
}

export class REPLClient {
  private readonly url: string

  constructor(options: REPLClientOptions) {
    this.url = options.url
  }

  subscribe(
    topic: string,
    onMessage: (message: REPLMessage) => unknown,
    onOpen?: (event: Event) => unknown,
    onError?: (event: Event) => unknown,
  ) {
    const source = new EventSource(`${this.url}/topics/${topic}/sse`)

    source.addEventListener('open', (event) => {
      onOpen?.(event)
    })

    source.addEventListener('error', (event) => {
      onError?.(event)
    })

    source.addEventListener('message', (event) => {
      const message = JSON.parse(event.data) as REPLMessage
      onMessage(message)
    })

    return () => source.close()
  }
}

export const repl = new REPLClient({
  mode: 'standalone',
  url: 'http://localhost:9000',
})
