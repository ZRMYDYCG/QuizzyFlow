/**
 * 将 Silicon Flow SSE 中的 reasoning_content 转为 AI SDK extractReasoningMiddleware 可识别的标签流。
 * middleware tagName 为 'think' → 标签即 <think> ... </think>
 */

const THINK_TAG = 'think'
const THINK_OPEN = `<${THINK_TAG}>`
const THINK_CLOSE = `</${THINK_TAG}>`

type StreamState = {
  thinkingOpen: boolean
}

function patchDelta(delta: Record<string, unknown>, state: StreamState) {
  const reasoning =
    typeof delta.reasoning_content === 'string' ? delta.reasoning_content : ''
  const content = typeof delta.content === 'string' ? delta.content : ''

  if (reasoning) {
    if (!state.thinkingOpen) {
      delta.content = `${THINK_OPEN}${reasoning}`
      state.thinkingOpen = true
    } else {
      delta.content = reasoning
    }
    delete delta.reasoning_content
    return
  }

  if (content && state.thinkingOpen) {
    delta.content = `${THINK_CLOSE}${content}`
    state.thinkingOpen = false
    return
  }

  if (content) {
    delta.content = content
  }
}

type StreamChoice = {
  index?: number
  delta?: Record<string, unknown>
}

type StreamChunk = {
  choices?: StreamChoice[]
}

/** AI SDK OpenAI parser requires choices[].index on every SSE chunk */
function normalizeStreamChunk(parsed: StreamChunk): StreamChunk {
  if (parsed.choices?.length) {
    parsed.choices = parsed.choices.map((choice, i) => ({
      ...choice,
      index: choice.index ?? i,
    }))
  }
  return parsed
}

function buildCloseThinkingChunk(): string {
  const payload = JSON.stringify(
    normalizeStreamChunk({
      choices: [{ index: 0, delta: { content: THINK_CLOSE } }],
    }),
  )
  return `data: ${payload}\n\n`
}

function transformSseLine(line: string, state: StreamState): string {
  const trimmed = line.trimEnd()
  if (!trimmed.startsWith('data:')) {
    return line
  }

  const payload = trimmed.slice(5).trim()
  if (!payload || payload === '[DONE]') {
    return line
  }

  try {
    const parsed = JSON.parse(payload) as StreamChunk & {
      choices?: Array<{ delta?: Record<string, unknown> }>
    }
    const delta = parsed.choices?.[0]?.delta
    if (delta) {
      patchDelta(delta, state)
    }
    return `data: ${JSON.stringify(normalizeStreamChunk(parsed))}`
  } catch {
    return line
  }
}

function transformSseStream(
  source: ReadableStream<Uint8Array>,
): ReadableStream<Uint8Array> {
  const decoder = new TextDecoder()
  const encoder = new TextEncoder()
  let buffer = ''
  const state: StreamState = { thinkingOpen: false }

  return source.pipeThrough(
    new TransformStream({
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          const out = transformSseLine(line, state)
          controller.enqueue(encoder.encode(`${out}\n`))
        }
      },
      flush(controller) {
        if (state.thinkingOpen) {
          controller.enqueue(encoder.encode(buildCloseThinkingChunk()))
          state.thinkingOpen = false
        }
        if (buffer) {
          controller.enqueue(encoder.encode(buffer))
        }
      },
    }),
  )
}

async function transformNonStreamResponse(response: Response): Promise<Response> {
  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json') || !response.ok) {
    return response
  }

  try {
    const data = (await response.json()) as {
      choices?: Array<{
        message?: {
          content?: string
          reasoning_content?: string
        }
      }>
    }
    const message = data.choices?.[0]?.message
    if (message?.reasoning_content) {
      const reasoning = message.reasoning_content
      const answer = message.content ?? ''
      message.content = `${THINK_OPEN}${reasoning}${THINK_CLOSE}${answer}`
      delete message.reasoning_content
    }

    return new Response(JSON.stringify(data), {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    })
  } catch {
    return response
  }
}

/** 注入 enable_thinking，并将 reasoning_content 转为 <think> 标签流 */
export function createSiliconFlowFetch(): typeof fetch {
  return async (input, init) => {
    let isStream = false

    if (init?.body && typeof init.body === 'string') {
      try {
        const body = JSON.parse(init.body) as Record<string, unknown>
        body.enable_thinking = true
        body.thinking_budget = 768
        const currentMax =
          typeof body.max_tokens === 'number' ? body.max_tokens : 4096
        body.max_tokens = Math.max(currentMax, 8192)
        isStream = body.stream === true
        init = { ...init, body: JSON.stringify(body) }
      } catch {
        // ignore
      }
    }

    const response = await fetch(input, init)

    if (isStream && response.ok && response.body) {
      return new Response(transformSseStream(response.body), {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      })
    }

    return transformNonStreamResponse(response)
  }
}
