import { tool } from 'ai'
import { z } from 'zod'
import { WebSearchService } from '../services/web-search.service'

function searchToolResult(payload: {
  query: string
  results: Array<{ title: string; url: string; snippet: string }>
  provider: string
  error?: string
}): string {
  if (payload.error) {
    return JSON.stringify({
      actionType: 'web_search_result',
      error: payload.error,
      data: { query: payload.query, results: [] },
      status: 'info_only',
    })
  }

  return JSON.stringify({
    actionType: 'web_search_result',
    summary: `已搜索「${payload.query}」，找到 ${payload.results.length} 条参考`,
    data: {
      query: payload.query,
      provider: payload.provider,
      results: payload.results,
    },
    status: 'info_only',
  })
}

export function createSearchTools(webSearchService: WebSearchService) {
  return {
    web_search: tool({
      description:
        '联网搜索业界最新资料、最佳实践、设计规范与参考案例。当用户询问行业趋势、问卷设计规范、UX 最佳实践、需要外部参考资料时调用；搜索后在正文中引用要点，参考链接会自动展示在消息底部。',
      inputSchema: z.object({
        query: z
          .string()
          .describe('搜索关键词，建议中英文结合，如「survey UX best practices 2025」'),
        maxResults: z
          .number()
          .int()
          .min(1)
          .max(8)
          .optional()
          .default(5)
          .describe('返回结果数量，默认 5'),
      }),
      execute: async ({ query, maxResults }) => {
        try {
          const result = await webSearchService.search(query, maxResults ?? 5)
          return searchToolResult(result)
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err)
          return searchToolResult({
            query,
            results: [],
            provider: 'none',
            error: message,
          })
        }
      },
    }),
  }
}
