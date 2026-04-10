import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'

import type { ApiFormError } from '../types/api-error'

export function applyServerErrors<TFieldValues extends FieldValues>(
  apiError: ApiFormError,
  setError: UseFormSetError<TFieldValues>,
) {
  if (apiError.errors) {
    Object.entries(apiError.errors).forEach(([name, message]) => {
      if (!message) {
        return
      }

      setError(name as Path<TFieldValues>, {
        type: 'server',
        message,
      })
    })

    return
  }

  if (apiError.error) {
    setError('root.server' as Path<TFieldValues>, {
      type: 'server',
      message: apiError.error,
    })
  }
}
