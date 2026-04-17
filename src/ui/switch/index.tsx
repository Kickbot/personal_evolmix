import { forwardRef } from 'react';

interface SwitchProps {
  id?: string;
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  labelClassName?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ id, label, checked = false, onChange, disabled, labelClassName }, ref) => {
    return (
      <div className="form-switch">
        {label && <label htmlFor={id} className={`form-label ${labelClassName}`}>{label}</label>}
        <div className="switch-wrapper">
          <input
            ref={ref}
            type="checkbox"
            id={id}
            className="switch-input"
            checked={checked}
            onChange={(e) => onChange?.(e.target.checked)}
            disabled={disabled}
          />
          <label htmlFor={id} className="switch-label">
            <span className="switch-slider"></span>
            <span className="switch-text">{checked ? 'ДА' : 'НЕТ'}</span>
          </label>
        </div>
      </div>
    );
  }
);
