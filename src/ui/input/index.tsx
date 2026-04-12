import './input.css'
import React from 'react'

import { cn } from 'utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode
  wrapperClassName?: string
  labelClassName?: string
  inputClassName?: string
  requiredMark?: boolean
  error?: string
  hint?: string
  isInvalid?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      name,
      type = 'text',
      label,
      className,
      wrapperClassName,
      labelClassName,
      inputClassName,
      required,
      error,
      hint,
      isInvalid,
      ...props
    },
    ref,
  ) => {
    const inputId = id ?? name
    const invalid = isInvalid ?? !!error

    return (
      <div className={cn('position-relative', wrapperClassName)}>
        {label && inputId && (
          <label
            htmlFor={inputId}
            className={cn(
              'form-label',
              required && 'required', 
              labelClassName,
            )}
          >
            {label}
          </label>
        )}

        <input
          {...props}
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          required={required}
          aria-invalid={invalid}
          className={cn('form-control', invalid && 'is-invalid', inputClassName, className)}
        />

        {error ? <div className="invalid-feedback d-block mb-2">{error}</div> : null}
        {!error && hint ? <div className="form-text">{hint}</div> : null}
      </div>
    )
  },
)

Input.displayName = 'Input'
