import './link.css'
import { Link as RouterLink, NavLink as RouterNavLink } from 'react-router-dom'
import { cn } from 'utils'

const classNames = {
  primary: 'btn btn-primary',
}
export function Link({ to, theme, className, children, ...props }: { to: string, theme?: string, className?: string, children: React.ReactNode }) {
  return (
    <RouterLink {...props} to={to} className={cn('', theme && classNames[theme as keyof typeof classNames], className)}>
      {children}
    </RouterLink>
  )
} 

export function NavLink({ className, children, ...props }: { className?: string, to: string, children?: React.ReactNode }) {
  return (
    <RouterNavLink {...props} className={({ isActive }) => cn('nav-link', isActive && 'active', className)}>
      {children}
    </RouterNavLink>
  )
}
