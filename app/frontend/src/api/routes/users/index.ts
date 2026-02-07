import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import type { UpdateUserRequestSchema } from '@/api/routes/users/type'
import { usersKeys } from '@/api/routes/users/key'
import { apiClient } from '@/api/shared/apiClient'
import { parseApiError } from '@/api/shared/error'

const useFetchSelfInfoOptions = () =>
  queryOptions({
    queryKey: usersKeys.me(),
    queryFn: async () => {
      const res = await apiClient.users.me.$get()
      if (!res.ok) {
        return await parseApiError(res)
      }
      return await res.json()
    },
  })

const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: UpdateUserRequestSchema) => {
      const res = await apiClient.users.me.$patch({ json: body })
      if (!res.ok) {
        return await parseApiError(res)
      }
      return await res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.me() })
    },
  })
}

export { useFetchSelfInfoOptions, useUpdateProfileMutation }
