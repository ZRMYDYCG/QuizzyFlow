import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

export interface WebSearchResultItem {
  title: string
  url: string
  snippet: string
}

export interface WebSearchResponse {
  query: string
  results: WebSearchResultItem[]
  provider: string
}

@Injectable()
export class WebSearchService {
  constructor(private readonly configService: ConfigService) {}

  async search(query: string, maxResults = 5): Promise<WebSearchResponse> {
    const trimmed = query.trim()
    if (!trimmed) {
      throw new Error('搜索关键词不能为空')
    }

    const limit = Math.min(Math.max(maxResults, 1), 10)
    const tavilyKey = this.configService.get<string>('TAVILY_API_KEY')?.trim()

    if (tavilyKey) {
      return this.searchWithTavily(trimmed, limit, tavilyKey)
    }

    return this.searchWithSerper(trimmed, limit)
  }

  private async searchWithTavily(
    query: string,
    maxResults: number,
    apiKey: string,
  ): Promise<WebSearchResponse> {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        search_depth: 'basic',
        max_results: maxResults,
        include_answer: false,
      }),
    })

    const data = (await response.json().catch(() => ({}))) as {
      error?: string
      results?: Array<{ title?: string; url?: string; content?: string }>
    }

    if (!response.ok) {
      throw new Error(data.error || `Tavily 搜索失败 (${response.status})`)
    }

    const results = (data.results ?? [])
      .filter((item) => item.url && item.title)
      .map((item) => ({
        title: item.title!.trim(),
        url: item.url!.trim(),
        snippet: (item.content ?? '').trim().slice(0, 280),
      }))

    return { query, results, provider: 'tavily' }
  }

  private async searchWithSerper(
    query: string,
    maxResults: number,
  ): Promise<WebSearchResponse> {
    const serperKey = this.configService.get<string>('SERPER_API_KEY')?.trim()
    if (!serperKey) {
      throw new Error(
        '未配置联网搜索 API。请在 server/.env 中设置 TAVILY_API_KEY 或 SERPER_API_KEY',
      )
    }

    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': serperKey,
      },
      body: JSON.stringify({
        q: query,
        num: maxResults,
      }),
    })

    const data = (await response.json().catch(() => ({}))) as {
      message?: string
      organic?: Array<{ title?: string; link?: string; snippet?: string }>
    }

    if (!response.ok) {
      throw new Error(data.message || `Serper 搜索失败 (${response.status})`)
    }

    const results = (data.organic ?? [])
      .filter((item) => item.link && item.title)
      .slice(0, maxResults)
      .map((item) => ({
        title: item.title!.trim(),
        url: item.link!.trim(),
        snippet: (item.snippet ?? '').trim(),
      }))

    return { query, results, provider: 'serper' }
  }
}
