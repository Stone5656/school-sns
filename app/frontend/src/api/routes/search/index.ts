import { queryOptions } from '@tanstack/react-query'
import type { SearchType } from 'backend/src/services/search/type'
import { searchKeys } from '@/api/routes/search/key'
import { apiClient } from '@/api/shared/apiClient'
import { parseApiError } from '@/api/shared/error'

const useSearchOptions = (keyword: string, searchType: SearchType = 'all') =>
  queryOptions({
    queryKey: searchKeys.result(keyword, searchType),
    queryFn: async () => {
      const res = await apiClient.search.$get({
        query: { keyword, type: searchType },
      })

      if (!res.ok) {
        return await parseApiError(res)
      }
      return await res.json()
    },
  })

export { useSearchOptions }
