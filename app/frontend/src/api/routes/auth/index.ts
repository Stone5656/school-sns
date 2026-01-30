import { useMutation, useQueryClient } from '@tanstack/react-query'
import type {
  LoginRequestBody,
  SignupRequestBody,
} from '@/api/routes/auth/type'
import { usersKeys } from '@/api/routes/users/key'
import { apiBaseUrl, apiClient } from '@/api/shared/apiClient'
import { ensureOk } from '@/api/shared/error'

const useLoginMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: LoginRequestBody) => {
      const res = await apiClient.auth.login.$post({ json: body })
      const response = await ensureOk(res)
      return await response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.me() })
    },
  })
}

const useGoogleLoginMutation = () => {
  return useMutation({
    mutationFn: () => {
      window.location.assign(`${apiBaseUrl}/api/v2/auth/google`)
      return Promise.resolve()
    },
  })
}

const useSignupMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: SignupRequestBody) => {
      const res = await apiClient.auth.signup.$post({ json: body })
      const response = await ensureOk(res)
      return await response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.me() })
    },
  })
}

const useLogoutMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const res = await apiClient.auth.logout.$post()
      const response = await ensureOk(res)
      return await response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.me() })
    },
  })
}

export {
  useLoginMutation,
  useGoogleLoginMutation,
  useSignupMutation,
  useLogoutMutation,
}
