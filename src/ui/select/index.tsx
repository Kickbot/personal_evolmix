import './select.css'
import React from 'react'

import { cn } from 'utils'

{/* как вариант можно так:
Select с options — компактный декларативный вариант (данные как массив)
Select с children — гибкий вариант (когда нужен <optgroup>, кастомные атрибуты и т.д.)
placeholder — автоматически рендерит <option value="" disabled> первым элементом, убирает дублирование
Обратная совместимость полная — существующий код с children продолжит работать
<Select
  id="choosePosition"
  {...register('role', {
    onChange: () => clearErrors('role'),
  })}
  label="Должность"
  required
  autoComplete="off"
  wrapperClassName="col-12 col-md-6"
  error={errors.role?.message}
>
  <option value="" disabled>
    Выберите должность
  </option>
  <option value="admin">Администратор</option>
  <option value="doctor">Доктор</option>
  <option value="pharmacist">Фармацевт</option>
  <option value="tech">Оператор</option>
</Select> */}

interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: React.ReactNode
  wrapperClassName?: string
  labelClassName?: string
  selectClassName?: string
  requiredMark?: boolean
  error?: string
  hint?: string
  isInvalid?: boolean
  options?: SelectOption[]
  placeholder?: string
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      id,
      name,
      label,
      className,
      wrapperClassName,
      labelClassName,
      selectClassName,
      required,
      requiredMark = true,
      error,
      hint,
      isInvalid,
      options,
      placeholder,
      children,
      ...props
    },
    ref,
  ) => {
    const selectId = id ?? name
    const invalid = isInvalid ?? !!error

    return (
      <div className={cn('position-relative', wrapperClassName)}>
        {label && selectId && (
          <label
            htmlFor={selectId}
            className={cn(
              'form-label',
              required && requiredMark && 'required',
              labelClassName,
            )}
          >
            {label}
          </label>
        )}

        <select
          {...props}
          ref={ref}
          id={selectId}
          name={name}
          required={required}
          aria-invalid={invalid}
          className={cn('form-select', invalid && 'is-invalid', selectClassName, className)}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>

        {error ? <div className="invalid-feedback d-block mb-2">{error}</div> : null}
        {!error && hint ? <div className="form-text">{hint}</div> : null}
      </div>
    )
  },
)

Select.displayName = 'Select'
