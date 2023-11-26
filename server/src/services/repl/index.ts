type REPLClientOptions = {
  mode: 'standalone'
  url: string
}

type REPLMessage = {
  value: string
  headers?: Record<string, string>
}

class REPLError extends Error {
  constructor(public message: string, public data?: any) {
    super(message)
  }
}

class REPLClient {
  private readonly url: string

  constructor(options: REPLClientOptions) {
    this.url = options.url
  }

  async create(name: string) {
    const response = await fetch(`${this.url}/topics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    })

    if (!response.ok) {
      throw new REPLError('Failed to create topic', await response.json())
    }
  }

  async publish(topic: string, message: REPLMessage) {
    const response = await fetch(`${this.url}/topics/${topic}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })

    if (!response.ok) {
      throw new Error('Failed to publish message')
    }
  }
}

export const repl = new REPLClient({
  mode: 'standalone',
  url: 'http://localhost:9000',
})
