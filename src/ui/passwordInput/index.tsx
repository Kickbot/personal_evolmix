import './passwordInput.css'
import React, { useState } from 'react'
import { HidePasswordIcon, VisiblePasswordIcon } from 'ui/icons'
import { cn } from 'utils'

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode
  wrapperClassName?: string
  labelClassName?: string
  inputClassName?: string
  requiredMark?: boolean
  error?: string
  hint?: string
  isInvalid?: boolean
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      id,
      name,
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
    const [isVisible, setIsVisible] = useState(false)
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

        <div className="password-field">
          <input
            {...props}
            ref={ref}
            id={inputId}
            name={name}
            type={isVisible ? 'text' : 'password'}
            required={required}
            aria-invalid={invalid}
            className={cn('form-control', invalid && 'is-invalid', inputClassName, className)}
          />

          <button
            type="button"
            className="password-field__toggle"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => setIsVisible((prev) => !prev)}
            aria-label={isVisible ? 'Hide password' : 'Show password'}
            aria-controls={inputId}
          >
            {isVisible ? <VisiblePasswordIcon /> : <HidePasswordIcon />} 
          </button>
        </div>

        {error ? <div className="invalid-feedback d-block mb-2">{error}</div> : null}
        {!error && hint ? <div className="form-text">{hint}</div> : null}
      </div>
    )
  },
)

PasswordInput.displayName = 'PasswordInput'
