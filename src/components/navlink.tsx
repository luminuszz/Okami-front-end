import { Link, LinkProps, useLocation } from 'react-router-dom'

import { isString } from '@/utils/helpers.ts'

interface NavLinkProps extends LinkProps {
  children: React.ReactNode
}

export function NavLink({ to, children, ...props }: NavLinkProps) {
  const { pathname } = useLocation()

  const isActive = isString(to) ? pathname === to : to.pathname === pathname

  return (
    <Link
      {...props}
      data-active={isActive}
      to={to}
      className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground data-[active=true]:text-foreground"
    >
      {children}
    </Link>
  )
}
