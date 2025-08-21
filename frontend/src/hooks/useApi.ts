import { useQuery, useMutation, useQueryClient } from 'react-query'
import { ApiResponse, PaginatedResponse, Prompt, GenerationRun, GenerationParameters, User } from '@/types'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// API client functions
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE}/api/v1${endpoint}`
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  // Add auth token if available
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${token}`,
    }
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`)
    }

    return data
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

// Auth API functions
export const authApi = {
  login: async (email: string, password: string) => {
    return apiRequest<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  refresh: async () => {
    return apiRequest<{ token: string; user: User }>('/auth/refresh', {
      method: 'POST',
    })
  },

  logout: async () => {
    return apiRequest('/auth/logout', {
      method: 'POST',
    })
  },
}

// Prompts API functions
export const promptsApi = {
  getAll: async (page = 1, limit = 20) => {
    return apiRequest<PaginatedResponse<Prompt>>(`/prompts?page=${page}&limit=${limit}`)
  },

  getById: async (id: string) => {
    return apiRequest<Prompt>(`/prompts/${id}`)
  },

  create: async (data: Partial<Prompt>) => {
    return apiRequest<Prompt>('/prompts', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  update: async (id: string, data: Partial<Prompt>) => {
    return apiRequest<Prompt>(`/prompts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  delete: async (id: string) => {
    return apiRequest(`/prompts/${id}`, {
      method: 'DELETE',
    })
  },
}

// Generation runs API functions
export const runsApi = {
  getAll: async (page = 1, limit = 20) => {
    return apiRequest<PaginatedResponse<GenerationRun>>(`/runs?page=${page}&limit=${limit}`)
  },

  getById: async (id: string) => {
    return apiRequest<GenerationRun>(`/runs/${id}`)
  },

  create: async (data: { promptId: string; parameters?: Partial<GenerationParameters> }) => {
    return apiRequest<GenerationRun>('/runs', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  cancel: async (id: string) => {
    return apiRequest<GenerationRun>(`/runs/${id}/cancel`, {
      method: 'POST',
    })
  },

  retry: async (id: string) => {
    return apiRequest<GenerationRun>(`/runs/${id}/retry`, {
      method: 'POST',
    })
  },
}

// Geometry API functions
export const geometryApi = {
  optimize: async (runId: string, options: any) => {
    return apiRequest(`/geometry/optimize`, {
      method: 'POST',
      body: JSON.stringify({ runId, ...options }),
    })
  },

  uvUnwrap: async (runId: string, options: any) => {
    return apiRequest(`/geometry/uv-unwrap`, {
      method: 'POST',
      body: JSON.stringify({ runId, ...options }),
    })
  },

  validate: async (runId: string) => {
    return apiRequest(`/geometry/validate/${runId}`)
  },

  remesh: async (runId: string, options: any) => {
    return apiRequest(`/geometry/remesh`, {
      method: 'POST',
      body: JSON.stringify({ runId, ...options }),
    })
  },
}

// Textures API functions
export const texturesApi = {
  bake: async (runId: string, options: any) => {
    return apiRequest(`/textures/bake`, {
      method: 'POST',
      body: JSON.stringify({ runId, ...options }),
    })
  },

  optimize: async (runId: string, options: any) => {
    return apiRequest(`/textures/optimize`, {
      method: 'POST',
      body: JSON.stringify({ runId, ...options }),
    })
  },

  pack: async (runId: string, options: any) => {
    return apiRequest(`/textures/pack`, {
      method: 'POST',
      body: JSON.stringify({ runId, ...options }),
    })
  },

  generate: async (runId: string, options: any) => {
    return apiRequest(`/textures/generate`, {
      method: 'POST',
      body: JSON.stringify({ runId, ...options }),
    })
  },
}

// Exports API functions
export const exportsApi = {
  getAll: async (page = 1, limit = 20) => {
    return apiRequest<PaginatedResponse<any>>(`/exports?page=${page}&limit=${limit}`)
  },

  getById: async (id: string) => {
    return apiRequest<any>(`/exports/${id}`)
  },

  create: async (runId: string, format: string, options: any) => {
    return apiRequest<any>('/exports', {
      method: 'POST',
      body: JSON.stringify({ runId, format, ...options }),
    })
  },

  batch: async (runIds: string[], format: string, options: any) => {
    return apiRequest<any>('/exports/batch', {
      method: 'POST',
      body: JSON.stringify({ runIds, format, ...options }),
    })
  },
}

// React Query hooks
export function usePrompts(page = 1, limit = 20) {
  return useQuery(
    ['prompts', page, limit],
    () => promptsApi.getAll(page, limit),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  )
}

export function usePrompt(id: string) {
  return useQuery(
    ['prompt', id],
    () => promptsApi.getById(id),
    {
      enabled: !!id,
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  )
}

export function useRuns(page = 1, limit = 20) {
  return useQuery(
    ['runs', page, limit],
    () => runsApi.getAll(page, limit),
    {
      keepPreviousData: true,
      staleTime: 30 * 1000, // 30 seconds (more frequent updates)
    }
  )
}

export function useRun(id: string) {
  return useQuery(
    ['run', id],
    () => runsApi.getById(id),
    {
      enabled: !!id,
      staleTime: 10 * 1000, // 10 seconds (frequent updates for active runs)
      refetchInterval: (data) => {
        // Refetch more frequently for active runs
        if (data?.data?.status && ['pending', 'planning', 'coarse_gen', 'mesh_recon', 'uv_unwrap', 'texture_bake', 'qa_safety', 'optimize', 'export'].includes(data.data.status)) {
          return 5000 // 5 seconds
        }
        return false
      },
    }
  )
}

// Mutation hooks
export function useCreatePrompt() {
  const queryClient = useQueryClient()
  
  return useMutation(promptsApi.create, {
    onSuccess: () => {
      queryClient.invalidateQueries(['prompts'])
    },
  })
}

export function useUpdatePrompt() {
  const queryClient = useQueryClient()
  
  return useMutation(
    ({ id, data }: { id: string; data: Partial<Prompt> }) => promptsApi.update(id, data),
    {
      onSuccess: (_, { id }) => {
        queryClient.invalidateQueries(['prompts'])
        queryClient.invalidateQueries(['prompt', id])
      },
    }
  )
}

export function useDeletePrompt() {
  const queryClient = useQueryClient()
  
  return useMutation(promptsApi.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries(['prompts'])
    },
  })
}

export function useCreateRun() {
  const queryClient = useQueryClient()
  
  return useMutation(runsApi.create, {
    onSuccess: () => {
      queryClient.invalidateQueries(['runs'])
    },
  })
}

export function useCancelRun() {
  const queryClient = useQueryClient()
  
  return useMutation(runsApi.cancel, {
    onSuccess: (_, id) => {
      queryClient.invalidateQueries(['runs'])
      queryClient.invalidateQueries(['run', id])
    },
  })
}

export function useRetryRun() {
  const queryClient = useQueryClient()
  
  return useMutation(runsApi.retry, {
    onSuccess: (_, id) => {
      queryClient.invalidateQueries(['runs'])
      queryClient.invalidateQueries(['run', id])
    },
  })
}

export function useLogin() {
  const queryClient = useQueryClient()
  
  return useMutation(
    ({ email, password }: { email: string; password: string }) => authApi.login(email, password),
    {
      onSuccess: (data) => {
        if (data.data?.token) {
          localStorage.setItem('auth_token', data.data.token)
        }
        queryClient.invalidateQueries(['user'])
      },
    }
  )
}

export function useLogout() {
  const queryClient = useQueryClient()
  
  return useMutation(authApi.logout, {
    onSuccess: () => {
      localStorage.removeItem('auth_token')
      queryClient.clear()
    },
  })
}
