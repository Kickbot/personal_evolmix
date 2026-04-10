import './button.css'
import React from 'react'

import { cn } from 'utils'


interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  primary?: boolean
  iconBefore?: React.ReactNode
  iconAfter?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className: customClassName, type: buttonType, primary, iconBefore, iconAfter, children, ...props }, ref) => {
    const isPrimary = primary || ['submit', 'primary'].includes(buttonType!)
    const className = cn(
      'button',
      isPrimary && 'primary',
      customClassName,
    )

    const type = ['submit', 'reset'].includes(buttonType!) ? buttonType : 'button'

    return (
      <button {...props} type={type} className={className} ref={ref}>
        {iconBefore && <span className="button-icon button-icon--before">{iconBefore}</span>}
        {children}
        {iconAfter && <span className="button-icon button-icon--after">{iconAfter}</span>}
      </button>
    )
  },
)


export const IconButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className, children, ...props }) => (
  <button type="button" {...props} className={cn('icon-button', className)}>
    {children}
  </button>
)