export interface ApiFormError {
  error?: string
  errors?: Record<string, string | undefined> | null
  body?: unknown
  unauthorized?: boolean
}
