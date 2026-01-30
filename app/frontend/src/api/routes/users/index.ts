import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { usersKeys } from '@/api/routes/users/key'
import { apiClient } from '@/api/shared/apiClient'
import { ensureOk } from '@/api/shared/error'

type UpdateProfileInput = {
  userName?: string
  bio?: string | null
  avatarUrl?: string | null
}

export type SelfInfo = {
  id: string
  userName: string
  bio: string | null
  avatarUrl: string | null
}

const useFetchSelfInfoOptions = () =>
  queryOptions({
    queryKey: usersKeys.me(),
    queryFn: async (): Promise<SelfInfo> => {
      const res = await apiClient.users.me.$get()
      const response = await ensureOk(res)
      return await response.json()
    },
  })

const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: UpdateProfileInput) => {
      const res = await apiClient.users.me.$patch({ json: body })
      const response = await ensureOk(res)
      return await response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.me() })
    },
  })
}

export { useFetchSelfInfoOptions, useUpdateProfileMutation }
